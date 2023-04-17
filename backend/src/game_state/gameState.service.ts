import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { GameState } from './gameState.class';
import { User } from 'src/user/entities/user.entity';
import { racketMoveDistance } from './gameState.constats';
import { match } from 'assert';
import { planeSize, racketSize } from './gameState.constats';

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
    if (user.id == game.playerOne.id) {
      game.playerOne.y += racketMoveDistance;
    }
    if (user.id == game.playerTwo.id) {
      game.playerTwo.y += racketMoveDistance;
    }
    const checkedGame = this.checkPlayerOutOfBounds(game);
    this.updateGame(gameId, checkedGame);
  }

  async playerDown(user: User, gameId: number) {
    const game = await this.redisService.getGameState(gameId);
    if (user.id == game.playerOne.id) {
      game.playerOne.y -= racketMoveDistance;
    }
    if (user.id == game.playerTwo.id) {
      game.playerTwo.y -= racketMoveDistance;
    }
    const checkedGame = this.checkPlayerOutOfBounds(game);
    this.updateGame(gameId, checkedGame);
  }

  async setRandomBallDirection(matchId: number) {
    const game = await this.getGame(matchId);
    const min = Math.ceil(3);
    const max = Math.floor(1);
    game.ballProperties.dx = Math.floor(Math.random() * (max - min) + min);
    game.ballProperties.dy = Math.floor(Math.random() * (max - min) + min);
    await this.updateGame(matchId, game);
  }

  bounceRacket(gameState: GameState) {
    if (
      gameState.ballProperties.x <= (planeSize.x / 2) * -1 + 30 &&
      gameState.ballProperties.y <= gameState.playerTwo.y + racketSize.y / 2 &&
      gameState.ballProperties.y >= gameState.playerTwo.y - racketSize.y / 2
    ) {
      gameState.ballProperties.dx *= -1;
    }
    if (
      gameState.ballProperties.x >= planeSize.x / 2 - 30 &&
      gameState.ballProperties.y <= gameState.playerOne.y + racketSize.y / 2 &&
      gameState.ballProperties.y >= gameState.playerOne.y - racketSize.y / 2
    ) {
      gameState.ballProperties.dx *= -1;
    }

    return gameState;
  }

  checkBallOutOfBounds(gameState: GameState) {
    if (
      gameState.ballProperties.x < (planeSize.x / 2) * -1 ||
      gameState.ballProperties.x > planeSize.x / 2
    ) {
      gameState.ballProperties.x = 0;
      gameState.ballProperties.y = 0;
    }
    return gameState;
  }

  checkPlayerOutOfBounds(gameState: GameState) {
    const upperBound = planeSize.y / 2 - racketSize.y / 2;
    const lowerBound = (planeSize.y / 2 * -1) + racketSize.y / 2;
    if (gameState.playerOne.y > upperBound) {
      gameState.playerOne.y = upperBound;
    }
    if (gameState.playerOne.y < lowerBound) {
      gameState.playerOne.y = lowerBound;
    }
    if (gameState.playerTwo.y > upperBound) {
      gameState.playerTwo.y = upperBound;
    }
    if (gameState.playerTwo.y < lowerBound) {
      gameState.playerTwo.y = lowerBound;
    }
    return gameState;
  }

  bounceBall(gameState: GameState) {
    var updatedGameState = this.bounceRacket(gameState);
    updatedGameState = this.checkBallOutOfBounds(gameState);
    if (
      updatedGameState.ballProperties.y >= planeSize.y / 2 ||
      updatedGameState.ballProperties.y <= (planeSize.y / 2) * -1
    ) {
      updatedGameState.ballProperties.dy *= -1;
    }

    return updatedGameState;
  }

  async moveBall(gameState: GameState, matchId: number) {
    gameState.ballProperties.x += gameState.ballProperties.dx;
    gameState.ballProperties.y += gameState.ballProperties.dy;
    var updatedGameState = this.bounceBall(gameState);

    await this.updateGame(matchId, updatedGameState);
    return this.getGame(matchId);
  }
}
