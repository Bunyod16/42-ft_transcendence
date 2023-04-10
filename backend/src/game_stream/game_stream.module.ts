import { Module } from '@nestjs/common';
import { GameStreamGateway } from './game_stream.gateway';
import { MatchModule } from 'src/match/match.module';
import { GameStateModule } from 'src/game_state/gameState.module';

@Module({
  imports: [MatchModule, GameStateModule],
  providers: [GameStreamGateway],
})
export class GameStreamModule {}
