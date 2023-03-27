import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...userProviders,
    UserService,
  ],
  controllers: [
    UserController
  ]
})
export class UserModule {}