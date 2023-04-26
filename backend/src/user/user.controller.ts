import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { encodePassword } from 'src/utils/bcrypt';
import { UserAuthGuard } from 'src/auth/auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interace';

export class temp {
  nickName?: string;
}

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = encodePassword(createUserDto.password);
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    Logger.log(`Trying to get all Users`, 'Users => findAll()');

    return users;
  }

  @Get('/many')
  async findMany(@Body() body: any) {
    const user_ids: number[] = body.ids;
    return this.userService.findMany(user_ids);
  }

  @Get('/findOneProfileByUsername/:username')
  async findOneProfileByUsername(@Param('username') username: string) {
    const user = await this.userService.findOneProfileByUsername(username);

    Logger.log(
      `Trying to get User with username = [${username}]`,
      'User => findOne()',
    );

    return user;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);

    Logger.log(`Trying to get User with id = [${id}]`, 'User => findOne()');

    return user;
    // if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    // return user;
  }

  @Get('check-nickname/:nickName')
  async checkUsername(@Param('nickName') nickName: string) {
    const user = await this.userService.findOneByUsername(nickName);

    Logger.log(`Finding user with nickName = [${nickName}]`);

    return user ? true : false;
  }

  @Get(':id/matches')
  async getMatches(@Param('id', ParseIntPipe) id: number) {
    const userMatches = await this.userService.getMatches(id);

    Logger.log(
      `Trying to get all matches for User with id = [${id}]`,
      'User => findOne()',
    );

    return userMatches;
  }

  @Patch()
  @UseGuards(UserAuthGuard)
  update(@Req() req: RequestWithUser, @Body() body: UpdateUserDto) {
    const updateUserDto = new UpdateUserDto(req.body);
    updateUserDto.nickName = req.body.nickName;
    updateUserDto.avatar = req.body.avatar;
    const reg = /^[a-z0-9]+$/i;
    return reg.test(updateUserDto.nickName)
      ? this.userService.update(req.user.id, updateUserDto)
      : new HttpException(
          'Nickname may only contain alphanumerical characters',
          HttpStatus.BAD_REQUEST,
        );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
