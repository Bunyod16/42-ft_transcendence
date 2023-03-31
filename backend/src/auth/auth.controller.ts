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
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly httpService: HttpService) {}

  @Get('login')
  @Redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-36394127e19c859453c0d0d02a6d2b1d790751d730df7a441442c52f262ccf9a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code&scope=public")
  login(): void {
    return;
  }

  @Get('callback')
    async ftAuthRedirect(
    @Query() query,
  ) {

    var postData = {
        'grant_type' : 'authorization_code',
        'client_id' : 'u-s4t2ud-36394127e19c859453c0d0d02a6d2b1d790751d730df7a441442c52f262ccf9a', // TODO: replace with env vars
        'client_secret' : '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', // TODO: replace with env vars
        'redirect_uri' : 'http://localhost:3000/auth/callback',
        'code' : `${query.code}`,
    };

    var headers: {
        'Content-Type': 'application/json',
    }
    
    try {
        const resp = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', postData, {headers});
        console.log(resp.data);
        const intra_data = await this.httpService.axiosRef.get('https://api.intra.42.fr/v2/me', {headers: {'Authorization':`Bearer ${resp.data.access_token}`}});
        console.log(intra_data.data);
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
    console.log(req);
    return req.user;
  }
}