import { Test, TestingModule } from '@nestjs/testing';
import { ChatLineController } from './chat_line.controller';
import { ChatLineService } from './chat_line.service';

describe('ChatLineController', () => {
  let controller: ChatLineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatLineController],
      providers: [ChatLineService],
    }).compile();

    controller = module.get<ChatLineController>(ChatLineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
