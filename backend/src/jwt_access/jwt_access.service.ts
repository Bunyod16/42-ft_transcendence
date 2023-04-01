import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { Config } from 'prettier';

@Injectable()
export class JwtAccessService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService) {}


  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRY'),
    });
  }

  async verifyAccessToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      const userId = payload.sub;
      return this.userService.findOne(userId);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}





