import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAccessService } from 'src/jwt_access/jwt_access.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtAccessService,
    private usersService: UserService,
  ) {}

  async signIn(username: string) {
    console.log(username);
    const user = await this.usersService.findOneByUsername(username);
    if (!user)
    {
        const new_user = new CreateUserDto();

        new_user.nickName = username;
        this.usersService.create(new_user);
    };
    const new_user = await this.usersService.findOneByUsername(username);
    return {
      access_token: await this.jwtService.generateAccessToken(new_user),
    };
  }
}