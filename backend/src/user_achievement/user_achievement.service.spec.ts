import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievement } from './entities/user_achievement.entity';
import { UserAchievementService } from './user_achievement.service';

describe('UserAchievementService', () => {
  let service: UserAchievementService;
  let repo: Repository<UserAchievement>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAchievementService,
        {
          provide: getRepositoryToken(UserAchievement),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserAchievementService>(UserAchievementService);
    repo = module.get<Repository<UserAchievement>>(
      getRepositoryToken(UserAchievement),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
