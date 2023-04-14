import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { GameState } from './gameState.class';
import { User } from 'src/user/entities/user.entity';
import { racketMoveDistance } from './gameState.constats';
import { match } from 'assert';
import { planeSize } from './gameState.constats';

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

  async connectUser(gameId: number, user: User) {
    const game = await this.getGame(gameId);
    console.log(game.playerOne.id);
    // console.log(user, game.playerOne);
    if (user.id == game.playerOne.id) {
      game.playerOne.isConnected = true;
    } else if (user.id == game.playerTwo.id) {
      game.playerTwo.isConnected = true;
    }
    return this.updateGame(gameId, game);
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

  async playerUp(user: User, gameId: number) {
    const game = await this.redisService.getGameState(gameId);
    if (user.id == game.playerOne.id)
    {
      game.playerOne.y += racketMoveDistance;
    }
    if (user.id == game.playerTwo.id)
    {
      game.playerTwo.y += racketMoveDistance;
    }
    this.updateGame(gameId, game);
  }

  async playerDown(user: User, gameId: number) {
    const game = await this.redisService.getGameState(gameId);
    if (user.id == game.playerOne.id)
    {
      game.playerOne.y -= racketMoveDistance;
    }
    if (user.id == game.playerTwo.id)
    {
      game.playerTwo.y -= racketMoveDistance;
    }
    this.updateGame(gameId, game);
  }

  async setRandomBallDirection(matchId: number) {
    const game = await this.getGame(matchId);
    const min = Math.ceil(-3);
    const max = Math.floor(3);
    game.ballProperties.dx = Math.floor(Math.random() * (max - min) + min);
    game.ballProperties.dy = Math.floor(Math.random() * (max - min) + min);
    await this.updateGame(matchId, game);
  }

  async moveBall(gameState: GameState, matchId: number) {
    gameState.ballProperties.x += gameState.ballProperties.dx;
    gameState.ballProperties.y += gameState.ballProperties.dy;
    if (gameState.ballProperties.x >= planeSize.x || gameState.ballProperties.x <= planeSize.x * -1) {
      gameState.ballProperties.dx *= -1;
    }
    if (gameState.ballProperties.y >= planeSize.y || gameState.ballProperties.y <= planeSize.y * -1) {
      gameState.ballProperties.dy *= -1;
    }
    await this.updateGame(matchId, gameState);
    return this.getGame(matchId);
  }
}
