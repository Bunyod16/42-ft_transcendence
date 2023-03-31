import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementService } from './user_achievement.service';

describe('UserAchievementService', () => {
  let service: UserAchievementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAchievementService],
    }).compile();

    service = module.get<UserAchievementService>(UserAchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
