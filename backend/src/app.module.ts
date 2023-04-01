import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorModule } from './two_factor/two_factor.module';
import { DatabaseModule } from './database/database.module';
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
    AuthModule,
    JwtAccessModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    UserService,
    ...userProviders,
  ],
})
export class AppModule {}
