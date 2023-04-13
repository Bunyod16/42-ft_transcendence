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

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameStreamGateway implements OnGatewayDisconnect {
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
    console.log(match);
    await this.stop_game(socket);
  }

  async stop_game(socket: Socket) {
    const user = socket.data.user;
    const match = await this.matchService.findCurrentByUser(user);
    if (!match) return;

    await this.server.to(`${match.id}`).emit('userDisconnected', user.nickName);
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    await this.removeInterval(match);
  }

  async end_game(match: Match) {
    const game = await this.gameStateService.getGame(match.id);
    await this.server.to(`${match.id}`).emit('gameEnded', game);
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    await this.removeInterval(match);
  }

  addInterval(match: Match) {
    console.log(match);
    console.log(match.id);
    const callback = async () => {
      const state = await this.gameStateService.getGame(match.id);
      console.log(`sending game state`);
      console.log(state);
      this.server.to(`${match.id}`).emit('updateGame', state);
    };

    const interval = setInterval(callback, 1000);
    this.schedulerRegistry.addInterval(`${match.id}`, interval);
    console.log(`match stream ${match.id} created!`);
  }

  removeInterval(match: Match) {
    this.schedulerRegistry.deleteInterval(`${match.id}`);
    console.log(`match stream ${match.id} deleted!`);
  }

  @SubscribeMessage('playerUp')
  playerUp(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    this.gameStateService.playerUp(socket.data.user, body.gameId);
  }

  @SubscribeMessage('playerDown')
  playerDown(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
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
      await this.server.to(`${match.id}`).emit('matchBegin');
      await this.addInterval(match);
    }
    return game;
  }

  @SubscribeMessage('userDisconnected')
  async leaveGame(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    await this.stop_game(socket);
  }

  // @SubscribeMessage('updateGameStream')
  // update(@MessageBody() updateGameStreamDto: UpdateGameStreamDto) {
  //   return this.gameStreamService.update(
  //     updateGameStreamDto.id,
  //     updateGameStreamDto,
  //   );
  // }

  // @SubscribeMessage('removeGameStream')
  // remove(@MessageBody() id: number) {
  //   return this.gameStreamService.remove(id);
  // }
}
