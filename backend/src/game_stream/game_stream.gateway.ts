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

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameStreamGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private gameStateService: GameStateService,
    private jwtAccessService: JwtAccessService,
    private matchService: MatchService,
  ) {}

  @UseGuards(UserAuthGuard)
  async handleDisconnect(socket: Socket) {
    await this.stop_game(socket);
  }

  async stop_game(socket: Socket) {
    const user = socket.data.user;
    const match = await this.matchService.findCurrentByUser(user);
    if (!match) return;

    await this.server.to(`${match.id}`).emit("userDisconnected", user.nickName);
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    await this.removeInterval(match);
  }

  async end_game(match: Match) {
    const game = await this.gameStateService.getGame(match.id);
    await this.server.to(`${match.id}`).emit("gameEnded", game);
    await this.matchService.updateGameEnded(match.id, match);
    await this.gameStateService.deleteGame(match.id);
    await this.removeInterval(match);
  }

  addInterval(match: Match) {
    console.log(match);
    console.log(match.id);
    const callback = async () => {
      console.log(`sending game state`);
      this.server
        .to(`${match.id}`)
        .emit('updateGame', await this.gameStateService.getGame(match.id));
    };

    const interval = setInterval(callback, 1000);
    this.schedulerRegistry.addInterval(`${match.id}`, interval);
    console.log(`match stream ${match.id} created!`);
  }

  removeInterval(match: Match) {
    this.schedulerRegistry.deleteInterval(`${match.id}`);
    console.log(`match stream ${match.id} deleted!`);
  }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('gameInfo')
  async gameInfo(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
    @MessageBody() body: any,
  ) {
    const game = await this.gameStateService.getGame(body.game_id);
    socket.emit(`gameInfo`, {
      user: req.user.nickName,
    });
    this.server.in(body.game_id).emit('gameInfo', game);
    this.gameStateService.connectUser(game.id, req.user);
    return game;
  }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('playerUp')
  playerUp(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
  ) {
    this.gameStateService.playerUp(req.user, body.gameId);
  }

  // @UseGuards(UserAuthGuard)
  // @SubscribeMessage('playerDown')
  // playerDown(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
  //   this.gameStateService.playerMoveDown(11);
  // }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('leaveGame')
  async leaveGame(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
  ) {
    await this.stop_game(socket);
  }
  // @UseGuards(UserAuthGuard)
  // @SubscribeMessage('connectGame')
  // async connectGame(
  //   @ConnectedSocket() socket: Socket,
  //   @Req() req: RequestWithUser,
  // ) {
  //   this.server.emit('message', { wtf: 'hello' });
  //   console.log('user attempting to connect to game');
  //   const match = await this.matchService.findCurrentByUser(req.user);
  //   if (!match) {
  //     socket.emit(`connect`, {match: null});
  //     return;
  //   }
  //   const game = await this.gameStateService.connectUser(match.id, req.user);
  //   socket.emit(`connectedToRoom`, {
  //     user: req.user.nickName,
  //     game: game,
  //   });
  //   return game;
  // }

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
