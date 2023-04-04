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
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
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
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const cookieHeader = request.headers.cookie;
      if (!cookieHeader) {
        return undefined;
      }
      const cookies = parse(cookieHeader);
      return cookies.Refresh;
    }
  }