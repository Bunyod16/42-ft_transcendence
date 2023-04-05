import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLineService } from './chat_line.service';
import { ChatLine } from './entities/chat_line.entity';

describe('ChatLineService', () => {
  let service: ChatLineService;
  let repo: Repository<ChatLine>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatLineService,
        {
          provide: getRepositoryToken(ChatLine),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChatLineService>(ChatLineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
