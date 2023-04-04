import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorController } from './two_factor.controller';
import { TwoFactorService } from './two_factor.service';
import { TwoFactor } from './entities/two_factor.entity';
import { CreateTwoFactorDto } from './dto/create-two_factor.dto';

const testCat1 = 'Test Cat 1';
const testBreed1 = 'Test Breed 1';

describe('TwoFactorController', () => {
  let controller: TwoFactorController;
  let service: TwoFactorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorController],
      providers: [
        {
          provide: TwoFactorService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              { name: 'Test Cat 2', breed: 'Test Breed 2', age: 3 },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<TwoFactorController>(TwoFactorController);
    service = module.get<TwoFactorService>(TwoFactorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
