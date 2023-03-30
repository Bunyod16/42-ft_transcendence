import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { achievementProviders } from './achievement.provider';

@Module({
  controllers: [AchievementController],
  providers: [...achievementProviders, AchievementService],
})
export class AchievementModule {}
