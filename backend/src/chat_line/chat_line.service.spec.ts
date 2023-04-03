import { Test, TestingModule } from '@nestjs/testing';
import { ChatLineService } from './chat_line.service';

describe('ChatLineService', () => {
  let service: ChatLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatLineService],
    }).compile();

    service = module.get<ChatLineService>(ChatLineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
