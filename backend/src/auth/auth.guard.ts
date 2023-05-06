import {
  ArgumentsHost,
  CanActivate,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { parse } from 'cookie';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { Socket } from 'socket.io';
import { SocketWithAuthData } from 'src/socket_io_adapter/socket-io-adapter.types';
import RequestWithUser from './requestWithUser.interace';

interface Token {
  refresh: string;
  access: string;
}

@Catch(HttpException)
export class ViewAuthFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('CAUGHT AN EXCEPTION');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    response.status(status).redirect('/auth/login');
  }
}

@Injectable()
@UseFilters(ViewAuthFilter)
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let cookie: string;

    if (context.getType() === 'http') {
      const request: Request = context.switchToHttp().getRequest();
      cookie = request.headers.cookie;
    } else if (context.getType() === 'ws') {
      const socket: Socket = context.switchToWs().getClient();
      cookie = socket.handshake.headers.cookie;
    }

    const token: Token | null = this.extractTokenFromCookie(cookie);
    if (!token) {
      console.log('Unauthorized request');
      return false
    }
    try {
      const payload = await this.jwtAccessService.verifyAccessToken(
        token.access,
      );

      // Not sure if guards should have greater than 1 responsibility, perhaps appending user can be done in an interceptor.
      // Feels like redundant code as a result..
      if (context.getType() === 'http') {
        let request: RequestWithUser = context.switchToHttp().getRequest();
        request.user = payload;
      } else if (context.getType() === 'ws') {
        let socket: SocketWithAuthData = context.switchToWs().getClient();
        socket.user = payload;
      }

      return true;
    } catch {
      console.log('AccessToken has expired');
      throw new HttpException(
        'AccessToken has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  extractTokenFromCookie(cookie: string): Token | null {
    try {
      const cookies = parse(cookie);
      const refresh: string = cookies.Refresh;
      const access: string = cookies.Authentication;
      if (refresh && access) {
        return { refresh, access };
      }
    } catch {
      console.log('No JWT was found in cookie');
    }

    return null;
  }
}
