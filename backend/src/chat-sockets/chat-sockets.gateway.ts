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
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
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
  ) {}

  afterInit() {
    Logger.log('chatSocket has been initialized');
  }

  // @UseGuards(UserAuthGuard)
  handleConnection(client: SocketWithAuthData) {
    console.log(client.user);
    console.log(`Amount of clients connected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} connected to chatSocket`);
    this.io.emit('connected');
  }

  // @UseGuards(UserAuthGuard)
  handleDisconnect(client: SocketWithAuthData) {
    console.log(`Amount of clients connected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} disconnected to chatSocket`);
    this.io.emit('connected');
  }

  /*
   * handleJoinRoom : Join room would mean tp click on chatChannel
   * */

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: SocketWithAuthData,
    @Req() req: any,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const user: User = req.user;
    console.log(user.nickName);

    try {
      const chatChannel = await this.chatChannelService.findOne(chatChannelId);
      const roomName = `chatChannel/${chatChannel.id}`;

      console.log(chatChannel);

      Logger.log(
        `User ${user.nickName} joined room [${roomName}]`,
        `ChatSocketsGateway => handleJoinRoom()`,
      );
      Logger.log(
        `chatChannelType = [${chatChannel.chatType} ${
          chatChannel.chatType === ChatType.GROUP_MESSAGE
            ? '|' + chatChannel.name
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

  // @UseGuards(UserAuthGuard)
  @SubscribeMessage('joinRoomTesting')
  async handleJoinRoomTesting(
    @ConnectedSocket() socket: Socket,
    @Body() body: any,
  ) {
    // console.log(que); //idk why i cant get query parameters
    try {
      const user: User = await this.userService.findOne(body[0].userId);
      console.log(user.nickName);
      const chatChannel = await this.chatChannelService.findOne(
        body[0].chatChannelId,
      );
      const roomName = `chatChannel/${chatChannel.id}`;

      console.log(chatChannel);

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

  @UseGuards(UserAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @Req() req: any,
    // client: Socket,
    @Body() body: ChatMessage,
    // @Body('message') message: string,
    // @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const userId = req.user.id;
    const message = body.message;
    const chatChannelId = body.chatChannelId;
    const roomName = `chatChannel/${chatChannelId}`;

    console.log(`send ${message} to room = ${roomName}`);
    this.io.in(`chatChannel/${chatChannelId}`).emit('chatMessage', message);

    //save message
    await this.chatLineService.create(
      message,
      chatChannelId,
      await this.userService.findOne(userId),
    );
  }

  // @UseGuards(UserAuthGuard)
  @SubscribeMessage('sendMessageTesting')
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

    console.log(`send ${message} to room = ${roomName}`);
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
