import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementController } from './user_achievement.controller';
import { UserAchievementService } from './user_achievement.service';

describe('UserAchievementController', () => {
  let controller: UserAchievementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAchievementController],
      providers: [UserAchievementService],
    }).compile();

    controller = module.get<UserAchievementController>(UserAchievementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
