import { Module } from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { ChatChannelsController } from './chat_channels.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAccessModule } from 'src/jwt_access/jwt_access.module';
import { JwtRefreshModule } from 'src/jwt_refresh/jwt_refresh.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { ChatChannel } from './entities/chat_channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatChannel]),
    HttpModule,
    UserModule,
    JwtAccessModule,
    JwtRefreshModule,
    AuthModule,
  ],
  providers: [ChatChannelsService],
  controllers: [ChatChannelsController],
  exports: [ChatChannelsService, TypeOrmModule],
})
export class ChatChannelsModule {}
