import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessService } from './jwt_access.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { userProviders } from 'src/user/user.providers';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [
    { provide: 'JwtAccessService', useClass: JwtAccessService },
    JwtAccessService,
    UserService,
    ...userProviders,
  ],
  exports: [JwtAccessService],
})
export class JwtAccessModule {}