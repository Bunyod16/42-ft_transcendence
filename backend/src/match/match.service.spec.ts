import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MatchService', () => {
  let service: MatchService;
  let repo: Repository<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    repo = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
