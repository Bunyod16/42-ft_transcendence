import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { userProviders } from 'src/user/user.providers';

@Module({
  imports: [
    HttpModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn : '60s'},
    }),
  ],
  providers: [
    AuthService,
    UserService,
    ...userProviders,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard, //Note: we can turn this on to require all end points to be authenticated by default
    // }
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
