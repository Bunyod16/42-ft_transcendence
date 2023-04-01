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
  Query,
} from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { Logger } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
import { UserAchievement } from './entities/user_achievement.entity';

@Controller('user-achievement')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
    private readonly userService: UserService, //im not sure if this is the right way to declare anotheservice in here
    private readonly achievementService: AchievementService, //im not sure if this is the right way to declare anotheservice in here
  ) {}

  @Post()
  async create(@Body() body: any) {
    const user_id: number = body.userId;
    const achievement_id: number = body.achievementId;

    const user: User = await this.userService.findOne(user_id);
    const achive: Achievement = await this.achievementService.findOne(
      achievement_id,
    );

    //see if user and achivement exist
    if (user === null) {
      Logger.log(
        `Bad Request: user with id = [${user_id}] Doesn't exist`,
        'UserAchivement => create()',
      );
      throw new HttpException(
        `Bad Request: user with id = [${user_id}] Doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (achive === null) {
      Logger.log(
        `Bad Request: achievement with id = [${achievement_id}] Doesn't exist`,
        'UserAchivement => create()',
      );
      throw new HttpException(
        `Bad Request: achievement with id = [${achievement_id}] Doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const createUserAchievementDto: CreateUserAchievementDto =
        new CreateUserAchievementDto();

      createUserAchievementDto.user = user;
      createUserAchievementDto.achievement = achive; //idk but if i use the var name achivement its blockscoped? idk with what

      const achievement = await this.userAchievementService.create(
        createUserAchievementDto,
      );

      Logger.log(
        `Created match with id = [${achievement}]`,
        'UserAchivement => create()',
      );

      return achievement;
    } catch (error) {
      Logger.error(error, `UserAchievement => create()`);
      throw new HttpException(
        `Bad Request: User already has achivement [${achive.name}]`,
        HttpStatus.BAD_REQUEST,
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('achievementId', ParseIntPipe) achivementId: number,
  ) {
    const user_achievement: UserAchievement =
      await this.userAchievementService.findOne(id);
    const achivement: Achievement = await this.achievementService.findOne(
      achivementId,
    );

    if (user_achievement === null) {
      throw new HttpException(
        `Bad Request: UserAchievement doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (achivement === null) {
      throw new HttpException(
        `Bad Request: Achievement doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updateUserAchievementDto: UpdateUserAchievementDto =
        new UpdateUserAchievementDto();

      updateUserAchievementDto.achievement = achivement;

      const res = await this.userAchievementService.update(
        id,
        updateUserAchievementDto,
      );

      res.raw = await this.userAchievementService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(error, `UserAchievement => update()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const achievement_raw = await this.userAchievementService.findOne(id);
      const achievement = await this.userAchievementService.remove(id);

      Logger.log(
        `Trying to delete achievement with id = [${id}]`,
        'UserAchivement => remove()',
      );

      if (!achievement || achievement.affected === 0) {
        Logger.log(
          `UserAchievement with id = [${id}] doeesn't exist`,
          'UserAchivement => remove()',
        );
        throw new HttpException(
          `Bad Request: User Achivement doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      Logger.log(
        `Deleted match with id = [${id}]`,
        'UserAchievement => remove()',
      );

      achievement.raw = achievement_raw;
      return achievement;
    } catch (error) {
      Logger.error(error, `UserAchievement => remove()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
