import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement]), ConfigModule],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService, TypeOrmModule],
})
export class AchievementModule {}
