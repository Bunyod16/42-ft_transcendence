import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { GameState } from './gameState.class';

@Injectable()
export class GameStateService {
  constructor(private redisService: RedisService) {}

  async createGame(id: number) {
    const game = new GameState(id);
    await this.redisService.setGameState(id, game);
    return this.redisService.getGameState(id);
  }

  async getGame(id: number): Promise<GameState> {
    return await this.redisService.getGameState(id);
  }

  async updateGame(id: number, game: GameState): Promise<void> {
    await this.redisService.setGameState(id, game);
  }
}