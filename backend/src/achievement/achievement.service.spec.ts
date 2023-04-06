import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementService } from './achievement.service';
import { Achievement } from './entities/achievement.entity';

describe('AchievementService', () => {
  let service: AchievementService;
  let repo: Repository<AchievementService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AchievementService>(AchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
