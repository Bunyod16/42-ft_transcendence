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
  UseGuards,
  Req,
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
import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { CustomException } from 'src/utils/app.exception-filter';

@ApiTags('user-achievement')
@Controller('user-achievement')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
    private readonly userService: UserService, //im not sure if this is the right way to declare anotheservice in here
    private readonly achievementService: AchievementService, //im not sure if this is the right way to declare anotheservice in here
  ) {}

  @UseGuards(UserAuthGuard)
  @Post()
  async create(
    @Req() req: any,
    @Body('achievementId', ParseIntPipe) achievementId: number,
  ) {
    const userId: number = req.user.id;
    const userAchievement = await this.userAchievementService.create(
      userId,
      achievementId,
    );

    Logger.log(
      `Created UserAchievement with id = [${userAchievement.id}]`,
      'UserAchivement => create()',
    );

    return userAchievement;
  }

  @Get()
  async findAll() {
    const achievement = this.userAchievementService.findAll();

    Logger.log(`Trying to get all achievements`, 'UserAchivement => findAll()');

    return achievement;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const userAchievement = await this.userAchievementService.findOne(id);

    Logger.log(
      `Trying to get userAchievement with id = [${id}]`,
      'UserAchivement => findOne()',
    );

    return userAchievement;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('achievementId', ParseIntPipe) achivementId: number,
  ) {
    const userAchievement = await this.userAchievementService.update(
      id,
      achivementId,
    );
    return userAchievement;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userAchievementService.remove(id);
    //   try {
    //     const achievement_raw = await this.userAchievementService.findOne(id);
    //     const achievement = await this.userAchievementService.remove(id);
    //
    //     Logger.log(
    //       `Trying to delete achievement with id = [${id}]`,
    //       'UserAchivement => remove()',
    //     );
    //
    //     if (!achievement || achievement.affected === 0) {
    //       Logger.log(
    //         `UserAchievement with id = [${id}] doeesn't exist`,
    //         'UserAchivement => remove()',
    //       );
    //       throw new HttpException(
    //         `Bad Request: User Achivement doesn't exist`,
    //         HttpStatus.BAD_REQUEST,
    //       );
    //     }
    //     Logger.log(
    //       `Deleted match with id = [${id}]`,
    //       'UserAchievement => remove()',
    //     );
    //
    //     achievement.raw = achievement_raw;
    //     return achievement;
    //   } catch (error) {
    //     Logger.error(error, `UserAchievement => remove()`);
    //     throw new HttpException(
    //       `Internal Server Error: Some bad shit happened`,
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
  }
}
