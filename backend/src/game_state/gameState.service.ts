import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { GameState } from './gameState.class';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GameStateService {
  constructor(private redisService: RedisService) {}

  async createGame(id: number, playerOneId: number, playerTwoId: number) {
    const game = new GameState(id, playerOneId, playerTwoId);
    console.log(`Game created with id ${id}`);
    await this.redisService.setGameState(id, game);
    return this.redisService.getGameState(id);
  }

  async createGameIfNotExist(
    id: number,
    playerOneId: number,
    playerTwoId: number,
  ) {
    const temp = await this.getGame(id);
    if (temp != null) return temp;
    return this.createGame(id, playerOneId, playerTwoId);
  }

  async connectUser(game_id: number, user: User) {
    const game = await this.getGame(game_id);
    console.log(game.playerOne.id);
    // console.log(user, game.playerOne);
    if (user.id == game.playerOne.id) {
      game.playerOne.isConnected = true;
    } else if (user.id == game.playerTwo.id) {
      game.playerTwo.isConnected = true;
    }
    return this.updateGame(game_id, game);
  }

  async getGame(id: number): Promise<GameState> {
    return await this.redisService.getGameState(id);
  }

  async updateGame(id: number, game: GameState): Promise<void> {
    await this.redisService.setGameState(id, game);
  }

  async deleteGame(id: number) {
    await this.redisService.deletGameState(id);
  }

  async getAllGames() {
    await this.redisService.getAllGames();
  }
}
