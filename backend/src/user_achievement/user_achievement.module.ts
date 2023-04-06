import { Module } from '@nestjs/common';
import { UserAchievementService } from './user_achievement.service';
import { UserAchievementController } from './user_achievement.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AchievementModule } from 'src/achievement/achievement.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './entities/user_achievement.entity';
import { UserService } from 'src/user/user.service';
import { AchievementService } from 'src/achievement/achievement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievement]),
    ConfigModule,
    UserModule,
    AchievementModule,
  ],
  controllers: [UserAchievementController],
  providers: [UserAchievementService, UserService, AchievementService],
  exports: [UserAchievementService, TypeOrmModule],
})
export class UserAchievementModule {}
