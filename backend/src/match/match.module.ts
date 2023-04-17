import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { GameStateModule } from 'src/game_state/gameState.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), ConfigModule, GameStateModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService, TypeOrmModule],
})
export class MatchModule {}
