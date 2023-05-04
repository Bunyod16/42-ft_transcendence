import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatSocketsService } from './chat-sockets.service';
import { Socket, Namespace } from 'socket.io';
import {
  Body,
  HttpStatus,
  Logger,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { ChatType } from 'src/chat_channels/entities/chat_channel.entity';
import { UserService } from 'src/user/user.service';
import { ChatLineService } from 'src/chat_line/chat_line.service';
import {
  CustomExceptionFilter,
  CustomWSException,
  CustomWSExceptionFilter,
} from 'src/utils/app.exception-filter';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SocketWithAuthData } from 'src/socket_io_adapter/socket-io-adapter.types';
import { FriendRequestService } from 'src/friend_request/friend_request.service';
import { ChatChannelMemberService } from 'src/chat_channel_member/chat_channel_member.service';
import {
  findUserSocketWithNamespace,
} from 'src/utils/socket-utils';
import { UserAchievementService } from 'src/user_achievement/user_achievement.service';

class ChatMessage {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsNumber()
  chatChannelId: number;
}

@WebSocketGateway({
  namespace: 'chatSockets',
  cors: { origin: true, credentials: true },
})
@UseFilters(CustomWSExceptionFilter) //idk why the global filters doesnt work i have to put this here
@UseFilters(CustomExceptionFilter)
export class ChatSocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Namespace;

  constructor(
    private readonly chatSocketsService: ChatSocketsService,
    private readonly chatChannelService: ChatChannelsService,
    private readonly userService: UserService,
    private readonly chatLineService: ChatLineService,
    private readonly chatChannelMemberService: ChatChannelMemberService,
    private readonly friendRequestService: FriendRequestService,
    private userAchievementsService: UserAchievementService,
  ) {}

  afterInit() {
    Logger.log('chatSocket has been initialized');
  }

  async emitConnectedToFriends(user: User) {
    const friends = await this.friendRequestService.findUserFriends(user.id);
    friends.forEach((data, _) => {
      if (data.friend.online) {
        const sock = findUserSocketWithNamespace(data.friend, this.io);
        if (sock) {
          sock.emit('friendOnline', user);
        }
      }
    });
  }

  handleConnection(client: SocketWithAuthData) {
    console.log(`Amount of clients connected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} connected to chatSocket`);
    console.log(
      `User with nickName = ${client.user.nickName} connected to chatSocket`,
    );
    this.io.emit('connected');
    this.userService.setOnline(client.user);
    this.emitConnectedToFriends(client.user);
    this.userAchievementsService.checkAchivementEligibility(client.user);
  }

  async emitDisconnectedToFriends(user: User) {
    const friends = await this.friendRequestService.findUserFriends(user.id);
    friends.forEach((data, _) => {
      if (data.friend.online) {
        const sock = findUserSocketWithNamespace(data.friend, this.io);
        if (sock) {
          sock.emit('friendOffline', user);
        }
      }
    });
  }

  handleDisconnect(client: SocketWithAuthData) {
    console.log(`Amount of clients disconnected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} disconnected to chatSocket`);
    console.log(
      `User with nickName = ${client.user.nickName} disconnected from chatSocket`,
    );
    this.io.emit('disconnected');
    this.userService.setOffline(client.user);
    this.emitDisconnectedToFriends(client.user);
  }

  /*
   * handleJoinRoom : Join room would mean tp click on chatChannel
   * */

  @SubscribeMessage('joinRoomDirectMessage')
  async handleJoinRoomDirectmessage(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const user: User = socket.user;
    const roomName = `chatChannel/${chatChannelId}`;
    console.log('asdfasdf');
    // if (friendId == user.id)
    //   throw new CustomWSException(
    //     `FriendId Can't be the same as UserId`,
    //     HttpStatus.BAD_REQUEST,
    //     `ChatSockets => handleJoinRoomTesting()`,
    //   );

    // const hasDirectMessage =
    //   await this.chatChannelMemberService.checkIfUserHasChatWithFriend(
    //     user.id,
    //     friendId,
    //   );

    //if user doesnt have direct message with friend
    // if (hasDirectMessage === false)
    //   await this.chatChannelService.create_direct_message(user.id, friendId);

    // //send chatInstance to front end to call api (they need ChatChannelId to query all past chats)
    // const chatInstance =
    //   await this.chatChannelMemberService.findUserChatWithFriend(
    //     user.id,
    //     friendId,
    //   );
    socket.join(roomName);
    Logger.log(
      `User ${user.nickName} joined room [${roomName}]`,
      `ChatSocketsGateway => joinRoomDirectMessage()`,
    );

    // this.io.emit('serverMessage', { chatInstance });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const user: User = socket.user;

    console.log('ASDFASDF');
    try {
      const chatChannel = await this.chatChannelService.findOne(chatChannelId);
      const roomName = `chatChannel/${chatChannel.id}`;

      Logger.log(
        `User ${user.nickName} joined room [${roomName}]`,
        `ChatSocketsGateway => handleJoinRoom()`,
      );
      Logger.log(
        `chatChannelType = [${chatChannel.chatType} ${
          chatChannel.chatType === ChatType.GROUP_MESSAGE
            ? ' |' + chatChannel.name
            : ''
        }] (ChatChannelId:${chatChannel.id})`,
        `ChatSocketsGateway => handleJoinRoom()`,
      );

      socket.join(roomName);
    } catch (error) {
      throw new CustomWSException(
        error.message,
        HttpStatus.BAD_REQUEST,
        `ChatSockets => handleJoinRoomTesting()`,
      );
    }
  }

  @SubscribeMessage('joinRoomTesting')
  async handleJoinRoomTesting(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    //  console.log(que); //idk why i cant get query parameters
    try {
      const user: User = await this.userService.findOne(body[0].userId);
      const chatChannel = await this.chatChannelService.findOne(
        body[0].chatChannelId,
      );
      const roomName = `chatChannel/${chatChannel.id}`;

      Logger.log(
        `User ${user.nickName} joined room [${roomName}]`,
        `ChatSocketsGateway => handleJoinRoomTesting()`,
      );
      Logger.log(
        `chatChannelType = [${chatChannel.chatType} ${
          chatChannel.chatType === ChatType.GROUP_MESSAGE
            ? '|' + chatChannel.name
            : ''
        }] (ChatChannelId:${chatChannel.id})`,
        `ChatSocketsGateway => handleJoinRoomTesting()`,
      );

      socket.join(roomName);
    } catch (error) {
      throw new CustomWSException(
        error.message,
        HttpStatus.BAD_REQUEST,
        `ChatSockets => handleJoinRoomTesting()`,
      );
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: SocketWithAuthData,
    @MessageBody() body: ChatMessage,
    // @Body('message') message: string,
    // @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const userId = socket.user.id;
    const message = body.message;
    const chatChannelId = body.chatChannelId;
    const roomName = `chatChannel/${chatChannelId}`;

    Logger.log(
      `send ${message} to room = ${roomName}`,
      `ChatSocketsGateway => sendMessage()`,
    );
    this.io.in(`chatChannel/${chatChannelId}`).emit('chatMessage', {
      text: message,
      sender: {
        id: userId,
        nickName: socket.user.nickName,
      },
    });

    //save message
    await this.chatLineService.create(
      message,
      chatChannelId,
      await this.userService.findOne(userId),
    );
  }

  async handleSendMessageTesting(
    // client: Socket,
    @Body() body: any,
    // @Body('message') message: string,
    // @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const userId = body[1].userId;
    const message = body[1].message;
    const chatChannelId = body[1].chatChannelId;
    const roomName = `chatChannel/${chatChannelId}`;

    Logger.log(
      `send ${message} to room = ${roomName}`,
      `ChatSocketsGateway => sendMessage()`,
    );
    this.io.in(`chatChannel/${chatChannelId}`).emit('chatMessage', message);
    //save message
    await this.chatLineService.create(
      message,
      chatChannelId,
      await this.userService.findOne(userId),
    );
  }

  @SubscribeMessage('getRooms')
  getRooms(client: Socket) {
    console.log(client.rooms);
    this.io.emit('serverMessage', { rooms: [...client.rooms] });
  }
}
