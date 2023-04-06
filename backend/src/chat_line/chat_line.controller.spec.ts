import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatLineController } from './chat_line.controller';
import { ChatLineService } from './chat_line.service';
import { ChatLine } from './entities/chat_line.entity';

describe('ChatLineController', () => {
  let controller: ChatLineController;
  let service: ChatLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatLineController],
      providers: [
        ChatLineService,
        {
          provide: getRepositoryToken(ChatLine),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ChatLineController>(ChatLineController);
    service = module.get<ChatLineService>(ChatLineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
