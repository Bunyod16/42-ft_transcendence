import { HttpCode, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string) {
    console.log(username);
    const user = await this.usersService.findOneByUsername(username);
    console.log(user);
    if (!user) //TODO: change this to register user instead
    {
        const new_user = new CreateUserDto();

        new_user.nickName = username;
        this.usersService.create(new_user);
    };
    const query_again = await this.usersService.findOneByUsername(username);
    const payload = { username: user.nickName, id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}