import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './auth.guard';
import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RequestWithUser from './requestWithUser.interace';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtAccessService: JwtAccessService,
  ) {}

  @Get('login')
  login(@Res() res) {
    return res.redirect(
      `https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.get(
        'FORTY_TWO_API_UID',
      )}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public`,
    );
  }

  @Get('callback')
  async ftAuthRedirect(@Query() query, @Req() request: RequestWithUser) {
    const { user } = request;
    const postData = {
      grant_type: 'authorization_code',
      client_id: this.configService.get('FORTY_TWO_API_UID'),
      client_secret: this.configService.get('FORTY_TWO_API_SECRET'),
      redirect_uri: 'http://localhost:3000/auth/callback',
      code: `${query.code}`,
    };

    var headers: {
      'Content-Type': 'application/json';
    };
    try {
      const resp = await this.httpService.axiosRef.post(
        'https://api.intra.42.fr/oauth/token',
        postData,
        { headers },
      );
      const intra_data = await this.httpService.axiosRef.get(
        'https://api.intra.42.fr/v2/me',
        { headers: { Authorization: `Bearer ${resp.data.access_token}` } },
      );
      const tokens = await this.authService.signIn(intra_data.data.login);

      request.res.setHeader('Set-Cookie', [
        tokens.accessToken,
        tokens.refreshToken,
      ]);
      return user;
    } catch (error) {
      console.log(error);
      console.log('Warning: User is not authenticated');
      throw HttpStatus.FORBIDDEN;
    }
  }

  @UseGuards(UserAuthGuard)
  @Get('refresh')
  refresh(@Req() req: RequestWithUser) {
    const accessTokenCookie = this.jwtAccessService.generateAccessToken(
      req.user,
    );

    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }

  @UseGuards(UserAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(UserAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}
