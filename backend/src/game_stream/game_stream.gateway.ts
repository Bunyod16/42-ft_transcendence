import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameStreamService } from './game_stream.service';
import { Server } from 'socket.io';
import { OnModuleDestroy, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Match } from 'src/match/entities/match.entity';
import { GameStateService } from 'src/game_state/gameState.service';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameStreamGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private gameStateService: GameStateService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Socket connected ${socket.id}`);
    });
  }

  onModuleDestroy() {
    this.server.on('connection', (socket) => {
      console.log(`Socket disconnected ${socket.id}`);
      // this.disconnectGame(socket);
    });
  }

  add(match: Match) {
    console.log(match);
    console.log(match.id);
    const callback = async () => {
      console.log(`sending game state`);
      this.server
        .to(`${match.id}`)
        .emit('updateGame', await this.gameStateService.getGame(match.id));
    };

    const interval = setInterval(callback, 1000); //TODO CHANGE SECONDS HERE
    this.schedulerRegistry.addInterval(`${match.id}`, interval);
    console.log(`match stream ${match.id} created!`);
  }

  remove(match: Match) {
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

  @SubscribeMessage('deleteGame')
  delete(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    this.gameStateService.deleteGame(11);
  }

  @SubscribeMessage('getAllGames')
  findAll(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    socket.emit('message', this.gameStateService.getAllGames());
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
