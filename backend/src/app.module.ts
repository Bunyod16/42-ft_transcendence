import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorModule } from './two_factor/two_factor.module';
import { MatchModule } from './match/match.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';
import { AchievementModule } from './achievement/achievement.module';
import { FriendRequestModule } from './friend_request/friend_request.module';
import { ChatLineModule } from './chat_line/chat_line.module';
import { AuthModule } from './auth/auth.module';
import { JwtAccessModule } from './jwt_access/jwt_access.module';
import { ChatChannelsModule } from './chat_channels/chat_channels.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { QueueModule } from './queue/queue.module';
import { GameStateModule } from './game_state/gameState.module';
import { GameStreamModule } from './game_stream/game_stream.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UserModule,
    TwoFactorModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
    UserAchievementModule,
    AchievementModule,
    FriendRequestModule,
    ChatLineModule,
    AuthModule,
    JwtAccessModule,
    ChatChannelsModule,
    QueueModule,
    GameStateModule,
    GameStreamModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
