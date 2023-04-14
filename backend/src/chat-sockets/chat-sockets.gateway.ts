import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { ChatSocketsService } from './chat-sockets.service';
import { Socket, Namespace } from 'socket.io';
import {
  Body,
  Logger,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entities/user.entity';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { ChatType } from 'src/chat_channels/entities/chat_channel.entity';
import { UserService } from 'src/user/user.service';
import { ChatLineService } from 'src/chat_line/chat_line.service';

@WebSocketGateway({
  namespace: 'chatSockets',
  cors: { origin: true, credentials: true },
})
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
    Logger.debug('chatSocket has been initialized');
  }

  @UseGuards(UserAuthGuard)
  handleConnection(client: Socket) {
    console.log(`Amount of clients connected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} connected to chatSocket`);
    this.io.emit('connected');
  }

  @UseGuards(UserAuthGuard)
  handleDisconnect(client: Socket) {
    console.log(`Amount of clients connected = ${this.io.sockets.size}`);
    console.log(`client with id = ${client.id} disconnected to chatSocket`);
    this.io.emit('connected');
  }

  /*
   * handleJoinRoom : Join room would mean on click chatChannel
   * */

  // @UseGuards(UserAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoomTesting(
    @ConnectedSocket() socket: Socket,
    // @Req() req: any,
    // @Query() que: any,
    @Body() body: any,
    // @Body('userId', ParseIntPipe) userId: number,
    // @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    // const user: User = req.user;
    const user: User = await this.userService.findOne(body[0].userId);
    console.log(user.nickName);

    // console.log(que); //idk why i cant get query parameters

    try {
      const chatChannel = await this.chatChannelService.findOne(
        body[0].chatChannelId,
      );
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
      Logger.log(error, `ChatSockets => handleJoinRoom()`);
      throw new WsException({ error: `${error}` }); //make custom webexception
    }
  }

  @SubscribeMessage('getRooms')
  getRooms(client: Socket) {
    console.log(client.rooms);
    this.io.emit('serverMessage', { rooms: [...client.rooms] });
  }

  // @UseGuards(UserAuthGuard)
  @SubscribeMessage('sendMessage')
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
}
