import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { MatchModule } from 'src/match/match.module';
import { AuthModule } from 'src/auth/auth.module';
import { QueueGateway } from './queue.gateway';
import { GameStreamModule } from 'src/game_stream/game_stream.module';
import { ChatLineModule } from 'src/chat_line/chat_line.module';
import { ChatChannelMemberModule } from 'src/chat_channel_member/chat_channel_member.module';

@Module({
  imports: [MatchModule, AuthModule, MatchModule, GameStreamModule, ChatLineModule, ChatChannelMemberModule],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway],
})
export class QueueModule {}
