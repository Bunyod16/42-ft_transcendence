import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorModule } from './two_factor/two_factor.module';
import { DatabaseModule } from './database/database.module';
import { MatchModule } from './match/match.module';
import { UserAchievementModule } from './user_achievement/user_achievement.module';

@Module({
  imports: [
    UserModule,
    TwoFactorModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
    UserAchievementModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
