import { Module } from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { ChatLineController } from './chat_line.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLine } from './entities/chat_line.entity';
import { ChatChannelsModule } from 'src/chat_channels/chat_channels.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatChannelMemberModule } from 'src/chat_channel_member/chat_channel_member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatLine]),
    ConfigModule,
    ChatChannelsModule,
    ChatChannelMemberModule,
    AuthModule,
  ],
  controllers: [ChatLineController],
  providers: [ChatLineService],
  exports: [ChatLineService, TypeOrmModule],
})
export class ChatLineModule {}
