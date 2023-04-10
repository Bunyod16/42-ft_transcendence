import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleDestroy, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { MatchService } from 'src/match/match.service';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { GameStateService } from 'src/game_state/gameState.service';
import { QueueService } from './queue.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshService } from 'src/jwt_refresh/jwt_refresh.service';
import { parse } from 'cookie';
import { CreateMatchDto } from 'src/match/dto/create-match.dto';

@WebSocketGateway()
export class QueueGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private queueService: QueueService,
    private jwtService: JwtRefreshService,
    private matchService: MatchService,
  ) {}

  @UseGuards(UserAuthGuard)
  handleConnection(client: any, ...args: any[]) {
    console.log(`${client.req} has connected`);
  }

  @UseGuards(UserAuthGuard)
  async handleDisconnect(socket) {
    console.log(socket.handshake.headers.cookie);

    const cookie = parse(socket.handshake.headers.cookie);
    const user = await this.jwtService.verifyRefreshToken(cookie.Refresh);
    console.log(`${user.nickName} has disconnected`);
    await this.queueService.removePlayerFromQueue(user);
  }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('queueEnter')
  async queueEnter(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
    @MessageBody() body: any,
  ) {
    try {
      const game = await this.queueService.addUserToQueue(req.user, socket.id);
      socket.emit('queueEnterSuccess', game);
    } catch (error) {
      console.log(error);
      socket.emit('queueEnterFail');
    }
    const queue = await this.queueService.getQueue();
    if (queue.length >= 2) {
      const match = new CreateMatchDto();
      match.playerOne = queue[0].user;
      match.playerTwo = queue[1].user;
      this.server.to(`${queue[0].socket_id}`).emit('matchFound', match);
      this.server.to(`${queue[1].socket_id}`).emit('matchFound', match);
      this.queueService.removePlayerFromQueue(queue[1].user);
      this.queueService.removePlayerFromQueue(queue[0].user);
      this.matchService.create(match);
    }
  }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('queueLeave')
  async queueLeave(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
    @MessageBody() body: any,
  ) {
    try {
      const game = await this.queueService.removePlayerFromQueue(req.user);
      socket.emit('queueLeaveSuccess', game);
    } catch (error) {
      console.log(error);
      socket.emit('queueLeaveFail');
    }
  }

  //     @SubscribeMessage('getAllGames')
  //     findAll(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
  //       socket.emit('message', this.gameStateService.getAllGames());
  //     }
}
