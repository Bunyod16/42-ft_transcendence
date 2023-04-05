import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from 'src/user/user.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { FriendRequestController } from './friend_request.controller';
import { FriendRequestService } from './friend_request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { FriendRequest } from './entities/friend_request.entity';
import { DataSource } from 'typeorm';

describe('FriendRequestController', () => {
  let controller: FriendRequestController;
  let service: FriendRequestService;

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
          }),
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          },
        }),
        TypeOrmModule.forFeature([FriendRequest]),
        UserModule,
        ConfigModule,
      ],
      controllers: [FriendRequestController, UserController],
      providers: [FriendRequestService, UserService],
    }).compile();

    controller = module.get<FriendRequestController>(FriendRequestController);
    service = module.get<FriendRequestService>(FriendRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
