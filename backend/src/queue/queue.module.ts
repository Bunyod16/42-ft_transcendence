import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { MatchModule } from 'src/match/match.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MatchModule, AuthModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
