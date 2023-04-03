import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { ChatChannelsController } from './chat_channels.controller';

@Module({
  controllers: [ChatChannelsController],
  providers: [ChatChannelsService]
})
export class ChatChannelsModule {}
