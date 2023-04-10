import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtRefreshService } from 'src/jwt_refresh/jwt_refresh.service';
import { parse } from 'cookie';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtRefreshService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('starting');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request, context);
    if (!token) {
      console.log('unauthrozied request');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyRefreshToken(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  extractTokenFromHeader(
    request: Request,
    context: any,
  ): string | undefined {
    try {
      var cookieHeader = request.headers.cookie;
      const cookies = parse(cookieHeader);
      return cookies.Refresh;
    } catch {
      console.log('Request did not have http cookie');
    }

    try {
      cookieHeader = context.getArgs()[0].handshake.headers.cookie;
      const cookies = parse(cookieHeader);
      return cookies.Refresh;
    } catch {
      console.log('Request did not have websocket cookie');
    }

    return undefined;
  }
}
