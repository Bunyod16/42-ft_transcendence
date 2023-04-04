import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshService } from './jwt_refresh.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule,
  ],
  providers: [
    { provide: 'JwtRefreshService', useClass: JwtRefreshService },
    JwtRefreshService,
    UserService,
    ConfigService,
  ],
  exports: [JwtRefreshService],
})
export class JwtRefreshModule {}
