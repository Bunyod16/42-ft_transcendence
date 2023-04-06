import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { JwtRefreshService } from 'src/jwt_refresh/jwt_refresh.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAccessService: JwtAccessService,
    private readonly jwtRefreshService: JwtRefreshService,
    private usersService: UserService,
  ) {}

  async signIn(username: string) {
    const existing_user = await this.usersService.findOneByUsername(username);
    if (!existing_user) {
      const new_user = new CreateUserDto();

      new_user.nickName = username;
      await this.usersService.create(new_user);
    }
    const user = await this.usersService.findOneByUsername(username);
    const accessToken = this.jwtAccessService.generateAccessToken(await user);
    const refreshToken = this.jwtRefreshService.generateRefreshToken(
      await user,
    );
    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);
    console.log({
      accessToken: accessToken,
      refreshToken: refreshToken.cookie,
    });
    return { accessToken: accessToken, refreshToken: refreshToken.cookie };
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
