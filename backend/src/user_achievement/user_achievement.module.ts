import { Module } from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { UserAchievementController } from './user_achievement.controller';
import { userAchievementProviders } from './user_achievement.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UserAchievementController],
  providers: [...userAchievementProviders, UserAchievementService],
})
export class UserAchievementModule {}
