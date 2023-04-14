import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';
import { Logger, } from '@nestjs/common';
import { Server, Namespace } from 'socket.io';
import { ChatLineService } from 'src/chat_line/chat_line.service';
import { User } from 'src/user/entities/user.entity';
import { SocketWithAuthData } from 'src/utils/types';
import { UserService } from '../user/user.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  namespace: 'chat',
  // Dynamically set cors link.
  // https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
  // Cors have to be manually set for gateways, don't know why.
  // Not necessary when custom socket-io-adapter with cors config is set up in main.ts
  // cors: {
  //   origin: [
  //     'http://localhost:8080',
  //      `${process.env.NEXT_HOST}:${process.env.NEXT_LISTEN_PORT}`
  //   ]
  // },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers: User[];

  constructor(
    private chatLineService: ChatLineService,
    private userService: UserService
    ) {
    this.connectedUsers = [];
  }

  @WebSocketServer()
  server: Namespace;

  afterInit(server: Server) {
    this.logger.log('Chat websocket initialized');
  }

  async handleConnection(client: SocketWithAuthData) {
    const sockets = this.server.sockets;
    const user = await this.userService.findOne(client.userId);

    this.connectedUsers = [
      ...this.connectedUsers,
      user
    ]

    this.logger.log(`User ${user.nickName}(id:${user.id}) with socket client id: ${client.id} has connected`);
    this.logger.debug(`Number of currently connected sockets: ${sockets.size}`);
  }

  async handleDisconnect(client: SocketWithAuthData) {
    const sockets = this.server.sockets;
    const user = await this.userService.findOne(client.userId);

    this.connectedUsers = this.connectedUsers.filter(connectedUser => connectedUser.id != user.id);
    this.logger.log(`User ${user.nickName}(id:${user.id}) with socket client id: ${client.id} has connected`);
    this.logger.debug(`Number of remaining connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('message')
  async message(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: SocketWithAuthData
    ) {
    const user = await this.userService.findOne(client.userId);
    await this.chatLineService.create(createChatDto.message, createChatDto.channelId, user);
    this.server.to(createChatDto.channelId.toString()).emit('message', {
      user: user.nickName,
      message: createChatDto.message
    });
  }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
    // return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
    // return this.chatService.remove(id);
  // }
}
