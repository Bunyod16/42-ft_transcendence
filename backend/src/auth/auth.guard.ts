import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtRefreshService } from 'src/jwt_refresh/jwt_refresh.service';
import { parse } from 'cookie';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request, context);
    if (!token) {
      console.log('Unauthorized request');
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtAccessService.verifyAccessToken(
        token.access,
      );
      request['user'] = payload;
      return true;
    } catch {
      console.log('AccessToken has expired');
      throw new UnauthorizedException();
    }
  }

  extractTokenFromHeader(
    request: Request,
    context: any,
  ): { refresh: string; access: string } | undefined {
    try {
      var cookieHeader = request.headers.cookie;
      const cookies = parse(cookieHeader);
      const refresh = cookies.Refresh;
      const access = cookies.Authentication;
      if (refresh && access) return { refresh, access };
    } catch {
      console.log('Request did not have http cookie');
    }

    try {
      cookieHeader = context.getArgs()[0].handshake.headers.cookie;
      const cookies = parse(cookieHeader);
      const refresh = cookies.Refresh;
      const access = cookies.Authentication;
      if (refresh && access) return { refresh, access };
    } catch {
      console.log('Request did not have websocket cookie');
    }

    return undefined;
  }
}
