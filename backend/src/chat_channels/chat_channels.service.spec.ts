import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelsService } from './chat_channels.service';

describe('ChatChannelsService', () => {
  let service: ChatChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatChannelsService],
    }).compile();

    service = module.get<ChatChannelsService>(ChatChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
