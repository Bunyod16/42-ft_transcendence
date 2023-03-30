import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorModule } from './two_factor/two_factor.module';
import { DatabaseModule } from './database/database.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    UserModule,
    TwoFactorModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MatchModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
