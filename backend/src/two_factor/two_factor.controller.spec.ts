import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorController } from './two_factor.controller';
import { TwoFactorService } from './two_factor.service';

describe('TwoFactorController', () => {
  let controller: TwoFactorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwoFactorController],
      providers: [TwoFactorService],
    }).compile();

    controller = module.get<TwoFactorController>(TwoFactorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
