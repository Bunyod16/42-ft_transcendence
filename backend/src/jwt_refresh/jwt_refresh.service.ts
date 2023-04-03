import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService) {}


  generateRefreshToken(user: User) {
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRY'),
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRY')}`; 
    return {
      cookie,
      token
    }
  }

  async verifyRefreshToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
      const userId = payload.sub;
      const user = await this.userService.getUserIfRefreshTokenMatches(token, userId);
      if (user)
        return user;
      throw new Error('Invalid refresh token');
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

}





