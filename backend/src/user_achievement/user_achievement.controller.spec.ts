import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AchievementModule } from 'src/achievement/achievement.module';
import { UserModule } from 'src/user/user.module';
import { UserAchievementController } from './user_achievement.controller';
import { UserAchievementService } from './user_achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserAchievement } from './entities/user_achievement.entity';
import { DataSource } from 'typeorm';

describe('UserAchievementController', () => {
  let controller: UserAchievementController;
  let service: UserAchievementService;

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
        TypeOrmModule.forFeature([UserAchievement]),
        UserModule,
        ConfigModule,
        AchievementModule,
      ],
      controllers: [UserAchievementController],
      providers: [
        {
          provide: UserAchievementService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserAchievementController>(
      UserAchievementController,
    );
    service = module.get<UserAchievementService>(UserAchievementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
