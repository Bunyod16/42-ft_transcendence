import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { ConfigModule } from '@nestjs/config';
import { matchProviders } from './match.provider';
import { userProviders } from 'src/user/user.providers';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [ConfigModule],
  controllers: [MatchController],
  providers: [...matchProviders, MatchService, ...userProviders, UserService],
})
export class MatchModule {}
