import { Module } from '@nestjs/common';
import { GameStateService } from './gameState.service';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GameStateService, RedisService, ConfigModule],
  exports: [GameStateService],
})
export class GameStateModule {}
