import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { achievementProviders } from './achievement.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AchievementController],
  providers: [...achievementProviders, AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
