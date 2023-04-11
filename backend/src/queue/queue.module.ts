import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { MatchModule } from 'src/match/match.module';
import { AuthModule } from 'src/auth/auth.module';
import { QueueGateway } from './queue.gateway';

@Module({
  imports: [MatchModule, AuthModule, MatchModule],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway],
})
export class QueueModule {}
