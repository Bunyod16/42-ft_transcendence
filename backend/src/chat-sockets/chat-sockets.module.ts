import { Module } from '@nestjs/common';
import { ChatSocketsService } from './chat-sockets.service';
import { ChatSocketsGateway } from './chat-sockets.gateway';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { ChatChannelsModule } from 'src/chat_channels/chat_channels.module';
import { UserModule } from 'src/user/user.module';
import { ChatLineModule } from 'src/chat_line/chat_line.module';
import { ChatChannelMemberModule } from 'src/chat_channel_member/chat_channel_member.module';
import { FriendRequestModule } from 'src/friend_request/friend_request.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ChatChannelsModule,
    UserModule,
    ChatLineModule,
    ChatChannelMemberModule,
    FriendRequestModule,
  ],
  providers: [ChatSocketsGateway, ChatSocketsService],
  exports: [ChatSocketsService],
})
export class ChatSocketsModule {}
