import { Module } from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { ChatLineController } from './chat_line.controller';
import { ConfigModule } from '@nestjs/config';
import { chatLineProviders } from './chat_line.providers';

@Module({
  imports: [ConfigModule],
  controllers: [ChatLineController],
  providers: [...chatLineProviders, ChatLineService],
})
export class ChatLineModule {}
