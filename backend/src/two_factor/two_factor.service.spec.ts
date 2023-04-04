import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorService } from './two_factor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TwoFactor } from './entities/two_factor.entity';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';
import { Repository } from 'typeorm';

const testNormalDto = new CreateTwoFactorDto();

describe('TwoFactorService', () => {
  let service: TwoFactorService;
  let repo: Repository<TwoFactor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFactorService,
        {
          provide: getRepositoryToken(TwoFactor),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(testNormalDto),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },],
    }).compile();

    service = module.get<TwoFactorService>(TwoFactorService);
    repo = module.get<Repository<TwoFactor>>(getRepositoryToken(TwoFactor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
