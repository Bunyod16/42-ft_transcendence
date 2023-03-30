import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { Logger } from '@nestjs/common';

@Controller('user-achievement')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Post()
  async create(@Body() createUserAchievementDto: CreateUserAchievementDto) {
    try {
      const achievement = await this.userAchievementService.create(
        createUserAchievementDto,
      );

      if (!achievement) {
        Logger.log(
          "Couldn't create userAchivement",
          'UserAchievement => create()',
        );
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      Logger.log(
        `Created match with id = [${achievement}]`,
        'UserAchivement => create()',
      );

      return achievement;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error: achievement id already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    const achievement = this.userAchievementService.findAll();

    Logger.log(`Trying to get all achievements`, 'UserAchivement => findAll()');

    if (!achievement) {
      Logger.log(`Cant find achievements table`, 'UserAchivement => findAll()');
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return achievement;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const achievement = this.userAchievementService.findOne(id);

    Logger.log(
      `Trying to get achievement with id = [${id}]`,
      'UserAchivement => findOne()',
    );

    if (!achievement) {
      Logger.log(
        `achievement with id = [${id}] doeesn't exist`,
        'UserAchivement => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return achievement;
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserAchievementDto: UpdateUserAchievementDto,
  // ) {
  //   return this.userAchievementService.update(+id, updateUserAchievementDto);
  // }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const achievement_raw = await this.userAchievementService.findOne(id);
    const achievement = await this.userAchievementService.remove(id);

    Logger.log(
      `Trying to delete achievement with id = [${id}]`,
      'UserAchivement => findOne()',
    );

    if (!achievement || achievement.affected === 0) {
      Logger.log(
        `achievement with id = [${id}] doeesn't exist`,
        'UserAchivement => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    Logger.log(`Deleted match with id = [${id}]`, '[match]');

    achievement.raw = achievement_raw;
    return achievement;
  }
}
