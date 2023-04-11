import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserModule } from 'src/user/user.module';
import { GameStateModule } from 'src/game_state/gameState.module';
import { GameStreamModule } from 'src/game_stream/game_stream.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ConfigModule,
    UserModule,
    GameStateModule,
    GameStreamModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, UserService],
  exports: [MatchService, TypeOrmModule],
})
export class MatchModule {}
