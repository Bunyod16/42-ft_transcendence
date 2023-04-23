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
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { encodePassword } from 'src/utils/bcrypt';

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

  @Get(':id/matches')
  async getMatches(@Param('id', ParseIntPipe) id: number) {
    const userMatches = await this.userService.getMatches(id);

    Logger.log(
      `Trying to get all matches for User with id = [${id}]`,
      'User => findOne()',
    );

    return userMatches;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
