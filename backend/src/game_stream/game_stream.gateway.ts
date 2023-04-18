import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameStreamService } from './game_stream.service';
import { OnModuleDestroy, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Match } from 'src/match/entities/match.entity';
import { GameStateService } from 'src/game_state/gameState.service';
import { parse } from 'cookie';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { MatchService } from 'src/match/match.service';
import { GameStream } from './entities/game_stream.entity';
import { User } from 'src/user/entities/user.entity';
import { GameState } from 'src/game_state/gameState.class';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameStreamGateway implements OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private gameStateService: GameStateService,
    private matchService: MatchService,
  ) {}

  @UseGuards(UserAuthGuard)
  async handleDisconnect(socket: Socket) {
    const match = await this.matchService.findCurrentByUser(socket.data.user);
    if (!match) return;
    const gameState = await this.gameStateService.getGame(match.id);
    await this.endGame(match, gameState);
  }

  async onModuleDestroy() {
    const matches = await this.matchService.findAllCurrent();
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      m.endedAt = new Date();
      console.log(m);
      await this.matchService.updateGameEnded(m.id, m);
    }
  }

  async stop_game(socket: Socket) {
    const user = socket.data.user;
    const match = await this.matchService.findCurrentByUser(user);
    if (!match) return;

    await this.server.to(`${match.id}`).emit('userDisconnected', user.nickName);
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    try {
      await this.removeInterval(match);
    } catch (error) {
      console.log(
        'Tried to remove interval for updateGame but it was already removed',
      );
    }
  }

  async endGame(match: Match, gameState: GameState) {
    const game = await this.gameStateService.getGame(match.id);
    await this.server.to(`${match.id}`).emit('gameEnded', game);
    match.playerOneScore = gameState.playerOne.score;
    match.playerTwoScore = gameState.playerTwo.score;
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    try {
      await this.removeInterval(match);
    } catch (error) {
      console.log(
        'Tried to remove interval for updateGame but it was already removed',
      );
    }
  }

  addInterval(match: Match) {
    const callback = async () => {
      const state = await this.gameStateService.getGame(match.id);
      if (!state) {
        console.log('game has not been found, cannot send state');
        return;
      }
      const moved_state = await this.gameStateService.moveBall(state, match.id);
      if (!moved_state) {
        console.log('moved_game has not been found, cannot send state');
        return;
      }
      if (
        moved_state.playerOne.score >= 5 ||
        moved_state.playerTwo.score >= 5
      ) {
        this.endGame(match, moved_state);
      }
      this.server.to(`${moved_state.id}`).emit('updateGame', moved_state);
    };

    const interval = setInterval(callback, 10);
    this.schedulerRegistry.addInterval(`${match.id}`, interval);
    console.log(`match stream ${match.id} created!`);
  }

  removeInterval(match: Match) {
    this.schedulerRegistry.deleteInterval(`${match.id}`);
    console.log(`match stream ${match.id} deleted!`);
  }

  @SubscribeMessage('playerUp')
  playerUp(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    if (!socket.data.user) {
      socket.emit('exception', {
        errorMessage: 'Undefined user in the socket, need to authenticate',
      });
      return;
    }
    this.gameStateService.playerUp(socket.data.user, body.gameId);
  }

  @SubscribeMessage('playerDown')
  playerDown(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    if (!socket.data.user) {
      socket.emit('exception', {
        errorMessage: 'Undefined user in the socket, need to authenticate',
      });
      return;
    }
    this.gameStateService.playerDown(socket.data.user, body.gameId);
  }

  @SubscribeMessage('userConnected')
  async userConnected(@ConnectedSocket() socket: Socket) {
    var match = await this.matchService.findCurrentByUser(socket.data.user);
    if (!match) {
      return;
    }
    await this.gameStateService.connectUser(match.id, socket.data.user);
    const game = await this.gameStateService.getGame(match.id);
    if (game.playerOne.isConnected && game.playerTwo.isConnected) {
      console.log('both players have connected to the game');
      await this.server.to(`${match.id}`).emit('matchBegin');
      await this.addInterval(match);
      await this.gameStateService.setRandomBallDirection(match.id);
    }
    return game;
  }

  @SubscribeMessage('userDisconnected')
  async leaveGame(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    await this.stop_game(socket);
  }
}
