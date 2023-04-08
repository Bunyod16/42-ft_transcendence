import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';
import { GameState } from './gameState.class';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis; // creates a new Redis client with default options

  constructor() {
    console.log('attempting to create client');
    this.client = new Redis('redis');
  }

  async setGameState(gameId: number, gameState: GameState) {
    await this.client.set(`game:${gameId}:state`, JSON.stringify(gameState));
  }

  async getGameState(gameId: number): Promise<GameState> {
    const gameStateString = await this.client.get(`game:${gameId}:state`);
    return JSON.parse(gameStateString);
  }
}
