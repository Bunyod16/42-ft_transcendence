import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Req, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { MatchService } from 'src/match/match.service';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { SocketWithAuthData } from 'src/socket_io_adapter/socket-io-adapter.types';
import { ChatLineService } from 'src/chat_line/chat_line.service';
import { ChatChannelMemberService } from 'src/chat_channel_member/chat_channel_member.service';
import { User } from 'src/user/entities/user.entity';
import { findUserSocket } from 'src/utils/socket-utils';
import { GameStreamGateway } from 'src/game_stream/game_stream.gateway';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class QueueGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private queueService: QueueService,
    private matchService: MatchService,
    private chatLineService: ChatLineService,
    private chatChannelMemberService: ChatChannelMemberService,
    private gameStreamGateway: GameStreamGateway,
  ) {}

  @UseGuards(UserAuthGuard)
  async handleDisconnect(socket: SocketWithAuthData) {
    await this.queueService.removePlayerFromQueue(socket.user); //TODO: find by socketid
    await this.chatLineService.deactivateInvites(socket.user);
  }

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('queueEnter')
  async queueEnter(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
    @MessageBody() body: any,
  ) {
    // console.log('entered queue');
    try {
      const currentGame = await this.matchService.findCurrentByUser(req.user);
      if (currentGame != null) {
        await this.gameStreamGateway.endGame(currentGame, null);
      }
      const game = await this.queueService.addUserToQueue(req.user, socket);
      socket.emit('queueEnterSuccess', game);
    } catch (error) {
      console.log(error);
      socket.emit('queueEnterFail');
    }
    const queue = await this.queueService.getQueue();
    console.log(`QUEUE: ${queue.length}`);
    if (queue.length >= 2) {
      const match = await this.matchService.create_with_user(
        queue[0].user,
        queue[1].user,
      );
      queue[0].socket.join(`${match.id}`);
      // this.server.to(`${match.id}`).emit('fuck');
      queue[1].socket.join(`${match.id}`);
      console.log(`Socket rooms of queue[0]: ${queue[0].socket.rooms}`);
      // await this.gameStreamGateway.addInterval(match);
      this.server.to(`${match.id}`).emit('matchFound', match);
      this.queueService.removePlayerFromQueue(queue[1].user);
      this.queueService.removePlayerFromQueue(queue[0].user);
    }
  }

  @SubscribeMessage('queueLeave')
  async queueLeave(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody() body: any,
  ) {
    try {
      const game = await this.queueService.removePlayerFromQueue(socket.user);
      socket.emit('queueLeaveSuccess', game);
      const queue = await this.queueService.getQueue();
      console.log(`QUEUE: ${queue.length}`);
    } catch (error) {
      console.log(error);
      socket.emit('queueLeaveFail');
    }
  }

  @SubscribeMessage('inviteFriend')
  async inviteFriend(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody() body: any,
  ) {
    console.log(
      `${socket.user.nickName} is inviting user with id (${body.friendId}) to a game`,
    );
    const dmChannel =
      await this.chatChannelMemberService.findUserChatWithFriend(
        socket.user.id,
        body.friendId,
      );
    this.chatLineService.createInvite(
      '',
      dmChannel.chatChannel.id,
      socket.user,
    );
    this.server.sockets.sockets.forEach(
      (data: Socket<any> & any, socket_id) => {
        console.log(body.friendId, data.user.id);
        if (body.friendId === data.user.id.toString()) {
          console.log('sent game invite');
          this.server.to(socket_id).emit('gameInvite', socket.user);
        }
      },
    );
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody() inviteSender: User,
  ) {
    console.log(`${socket.user.nickName} has accepted invite to a game`);
    const invite = await this.chatLineService.findInvite(
      socket.user,
      inviteSender,
    );
    if (invite == null) {
      socket.emit('acceptInviteRejected');
      return;
    } else {
      console.log('match invite found');
      const senderSocket = findUserSocket(inviteSender, this.server);
      const match = await this.matchService.create_with_user(
        socket.user,
        inviteSender,
      );
      senderSocket.join(`${match.id}`);
      socket.join(`${match.id}`);
      this.server.to(`${match.id}`).emit('matchFound', match);
    }
  }

  @SubscribeMessage('cancelPlayWithFriend')
  async deactivateInvites(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody() inviteSender: User,
  ) {
    this.chatLineService.deactivateInvites(socket.user);
  }
}
