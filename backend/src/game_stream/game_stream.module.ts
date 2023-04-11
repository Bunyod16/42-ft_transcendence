import { Module } from '@nestjs/common';
import { GameStreamGateway } from './game_stream.gateway';
import { GameStateModule } from 'src/game_state/gameState.module';
import { GameStreamService } from './game_stream.service';
import { MatchModule } from 'src/match/match.module';
import { JwtAccessModule } from 'src/jwt_access/jwt_access.module';

@Module({
  imports: [GameStateModule, JwtAccessModule, MatchModule],
  providers: [GameStreamGateway, GameStreamService],
  exports: [GameStreamGateway, GameStreamService],
})
export class GameStreamModule {}
