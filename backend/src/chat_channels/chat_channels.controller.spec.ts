import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelsController } from './chat_channels.controller';
import { ChatChannelsService } from './chat_channels.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { JwtAccessModule } from 'src/jwt_access/jwt_access.module';
import { JwtRefreshModule } from 'src/jwt_refresh/jwt_refresh.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ChatChannel } from './entities/chat_channel.entity';

describe('ChatChannelsController', () => {
  let controller: ChatChannelsController;
  let service: ChatChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password123',
            database: 'rgm',
            synchronize: false,
            // entities: [User, ChatChannel],
          }),
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
        TypeOrmModule.forFeature([ChatChannel]),
        HttpModule,
        UserModule,
        JwtAccessModule,
        JwtRefreshModule,
        AuthModule,
        ConfigModule,
      ],
      controllers: [ChatChannelsController, UserController],
      providers: [ChatChannelsService, UserService],
    }).compile();

    controller = module.get<ChatChannelsController>(ChatChannelsController);
    service = module.get<ChatChannelsService>(ChatChannelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
