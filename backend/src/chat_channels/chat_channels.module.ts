import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { ChatChannelsController } from './chat_channels.controller';
import { chatChannelProviders } from './chat_channels.providers';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAccessModule } from 'src/jwt_access/jwt_access.module';
import { JwtRefreshModule } from 'src/jwt_refresh/jwt_refresh.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    JwtAccessModule,
    JwtRefreshModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [...chatChannelProviders, ChatChannelsService],
  controllers: [ChatChannelsController],
  exports: [ChatChannelsService],
})
export class ChatChannelsModule {}
