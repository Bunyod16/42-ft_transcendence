import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import { GameState } from './gameState.class';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private client: Redis; // creates a new Redis client with default options

  constructor(private configService: ConfigService) {
    this.client = new Redis(configService.get('REDIS_CONNECTION'));
  }

  async setGameState(gameId: number, gameState: GameState) {
    await this.client.set(`game:${gameId}:state`, JSON.stringify(gameState));
  }

  async getGameState(gameId: number): Promise<GameState> {
    const gameStateString = await this.client.get(`game:${gameId}:state`);
    return JSON.parse(gameStateString);
  }

  async deletGameState(gameId: number) {
    const gameStateString = await this.client.del(`game:${gameId}:state`);
  }

  async getAllGames() {
    const allGames = await this.client.keys(`game:*`);
    return allGames;
  }
}
