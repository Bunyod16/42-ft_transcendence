import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import { GameState } from './gameState.class';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private client: Redis; // creates a new Redis client with default options

  constructor(private configService: ConfigService) {

    const redis_port: number = configService.get<number>('REDIS_PORT') || 6379;
    const redis_host: string = configService.get('REDIS_HOST') || 'localhost';

    this.client = new Redis(
      redis_port,
      redis_host,
    );
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

  async deleteAllGames(gameId: number) {
    const gameStateString = await this.client.del(`game:*`);
  }
}
