import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatLineModule } from 'src/chat_line/chat_line.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ChatLineModule, UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
