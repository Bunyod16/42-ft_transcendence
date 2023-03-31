import { Module } from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { UserAchievementController } from './user_achievement.controller';
import { userAchievementProviders } from './user_achievement.providers';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [ConfigModule, UserModule, AchievementModule],
  controllers: [UserAchievementController],
  providers: [...userAchievementProviders, UserAchievementService],
})
export class UserAchievementModule {}
