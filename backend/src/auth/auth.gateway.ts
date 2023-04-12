import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Match } from 'src/match/entities/match.entity';
import { GameStateService } from 'src/game_state/gameState.service';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { MatchService } from 'src/match/match.service';
import { Req, UseGuards } from '@nestjs/common';
import { parse } from 'cookie';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class AuthGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtAccessService: JwtAccessService) {}

  @SubscribeMessage('authenticateUser')
  async gameInfo(
    @ConnectedSocket() socket: Socket,
    @Req() req: RequestWithUser,
    @MessageBody() body: any,
  ) {
    try {
      const cookie = parse(socket.handshake.headers.cookie);
      const user = await this.jwtAccessService.verifyAccessToken(
        cookie.Authentication,
      );
      socket.data.user = user;
    } catch (error) {
      console.log(`Error in auth websocket: ${error}`);
    }
  }
}
