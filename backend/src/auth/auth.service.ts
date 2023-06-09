import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { JwtRefreshService } from 'src/jwt_refresh/jwt_refresh.service';
import { TwoFactorService } from 'src/two_factor/two_factor.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAccessService: JwtAccessService,
    private readonly jwtRefreshService: JwtRefreshService,
    private usersService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async signIn(username: string) {
    const existing_user = await this.usersService.findOneByIntraname(username);
    if (!existing_user) {
      console.log('registering new user');
      const new_user = new CreateUserDto();

      new_user.intraName = username;
      new_user.avatar = `https://source.boringavatars.com/beam/40/${username}?square`;
      await this.usersService.create(new_user);
    }
    const user = await this.usersService.findOneByIntraname(username);
    await this.usersService.setRefeshToken2FA(user.id, true);
    try {
      await this.twoFactorService.findOneWithUserId(user.id);
      console.log('user has 2fa');
      await this.usersService.setRefeshToken2FA(user.id, false);
    } catch {
      console.log('user doesnt have 2fa');
    }
    const accessToken = this.jwtAccessService.generateAccessToken(user);
    const refreshToken = this.jwtRefreshService.generateRefreshToken(user);
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
