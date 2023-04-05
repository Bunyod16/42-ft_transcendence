import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { JwtAccessModule } from 'src/jwt_access/jwt_access.module';
import { JwtRefreshModule } from 'src/jwt_refresh/jwt_refresh.module';
import { ConfigModule } from '@nestjs/config';
import { Global } from '@nestjs/common';

@Global()
@Module({
  imports: [
    HttpModule,
    UserModule,
    JwtAccessModule,
    JwtRefreshModule,
    AuthModule,
    ConfigModule,
  ],
  providers: [
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard, //Note: we can turn this on to require all end points to be authenticated by default
    // }
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtAccessModule, JwtRefreshModule],
})
export class AuthModule {}
