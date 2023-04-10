import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/auth.guard';

@ApiTags('user-achievement')
@Controller('user-achievement')
export class UserAchievementController {
  constructor(
    private readonly userAchievementService: UserAchievementService,
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
  }
}
