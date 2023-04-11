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
import { GameStateService } from 'src/game_state/gameState.service';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class GameStreamGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server: Server;

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

  constructor(private gameStateService: GameStateService) {}

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
