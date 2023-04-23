import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendRequestController } from './friend_request.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend_request.entity';
import { UserModule } from 'src/user/user.module';
import { ChatChannelMemberModule } from 'src/chat_channel_member/chat_channel_member.module';
import { ChatChannelsModule } from 'src/chat_channels/chat_channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest]),
    ConfigModule,
    UserModule,
    ChatChannelMemberModule,
    UserModule,
    ChatChannelsModule
  ],
  providers: [FriendRequestService],
  controllers: [FriendRequestController],
  exports: [FriendRequestService, TypeOrmModule],
})
export class FriendRequestModule {}
