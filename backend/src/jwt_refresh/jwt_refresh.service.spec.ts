import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshService } from './jwt_refresh.service';

describe('JwtRefreshService', () => {
  let service: JwtRefreshService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtRefreshService],
    }).compile();

    service = module.get<JwtRefreshService>(JwtRefreshService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
