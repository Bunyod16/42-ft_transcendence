import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Redirect,
  Query,
  HttpException,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,) {}

  @Get('login')
  login(@Res() res) {
    return res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${this.configService.get('FORTY_TWO_API_UID')}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public`);
  }

  @Get('callback')
    async ftAuthRedirect(
    @Query() query,
  ) {

    var postData = {
        'grant_type' : 'authorization_code',
        'client_id' : this.configService.get('FORTY_TWO_API_UID'),
        'client_secret' : this.configService.get('FORTY_TWO_API_SECRET'),
        'redirect_uri' : 'http://localhost:3000/auth/callback',
        'code' : `${query.code}`,
    };

    var headers: {
        'Content-Type': 'application/json',
    }
    
    try {
        const resp = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', postData, {headers});
        const intra_data = await this.httpService.axiosRef.get('https://api.intra.42.fr/v2/me', {headers: {'Authorization':`Bearer ${resp.data.access_token}`}});
        return this.authService.signIn(intra_data.data.login)
    }
    catch (error) {
        console.log(error);
        console.log("Warning: User is not authenticated")
        throw HttpStatus.FORBIDDEN;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}