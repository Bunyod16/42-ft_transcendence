import { Module, forwardRef } from '@nestjs/common';
import { ChatChannelMemberService } from './chat_channel_member.service';
import { ChatChannelMemberController } from './chat_channel_member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatChannelMember } from './entities/chat_channel_member.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { ChatChannelsModule } from 'src/chat_channels/chat_channels.module';
import { UserService } from 'src/user/user.service';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatChannelMember]),
    ConfigModule,
    UserModule,
    forwardRef(() => ChatChannelsModule), //for circular dependency
  ],
  controllers: [ChatChannelMemberController],
  providers: [ChatChannelMemberService, UserService, ChatChannelsService],
  exports: [ChatChannelMemberService, TypeOrmModule],
})
export class ChatChannelMemberModule {}
