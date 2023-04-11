import { Module } from '@nestjs/common';
import { GameStreamGateway } from './game_stream.gateway';
import { GameStateModule } from 'src/game_state/gameState.module';
import { GameStreamService } from './game_stream.service';

@Module({
  imports: [GameStateModule],
  providers: [GameStreamGateway, GameStreamService],
  exports: [GameStreamService]
})
export class GameStreamModule {}
