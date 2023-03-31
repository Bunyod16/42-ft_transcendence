import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendRequestController } from './friend_request.controller';
import { ConfigModule } from '@nestjs/config';
import { friendRequestProviders } from './friend_request.providers';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [FriendRequestController],
  providers: [...friendRequestProviders, FriendRequestService],
})
export class FriendRequestModule {}
