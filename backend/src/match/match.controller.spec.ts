import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
