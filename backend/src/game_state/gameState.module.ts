import { Module } from '@nestjs/common';
import { GameStateService } from './gameState.service';
import { RedisService } from './redis.service';

@Module({
  providers: [GameStateService, RedisService],
  exports: [GameStateService],
})
export class GameStateModule {}
