import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorModule } from './two_factor/two_factor.module';
import { DatabaseModule } from './database/database.module';
import { MatchModule } from './match/match.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';
import { AchievementModule } from './achievement/achievement.module';
import { FriendRequestModule } from './friend_request/friend_request.module';
import { ChatLineModule } from './chat_line/chat_line.module';
import { AuthModule } from './auth/auth.module';
import { JwtAccessModule } from './jwt_access/jwt_access.module';
import { UserService } from './user/user.service';
import { userProviders } from './user/user.providers';

@Module({
  imports: [
    UserModule,
    TwoFactorModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
    UserAchievementModule,
    AchievementModule,
    FriendRequestModule,
    ChatLineModule,
    AuthModule,
    JwtAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, ...userProviders],
})
export class AppModule {}
