import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { Achievement } from './entities/achievement.entity';

describe('AchievementController', () => {
  let controller: AchievementController;
  let service: AchievementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
      providers: [
        AchievementService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
    service = module.get<AchievementService>(AchievementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
