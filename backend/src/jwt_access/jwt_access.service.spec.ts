import { Test, TestingModule } from '@nestjs/testing';
import { JwtAccessService } from './jwt_access.service';

describe('JwtAccessService', () => {
  let service: JwtAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAccessService],
    }).compile();

    service = module.get<JwtAccessService>(JwtAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
