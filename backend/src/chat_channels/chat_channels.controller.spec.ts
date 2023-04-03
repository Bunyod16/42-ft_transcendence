import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelsController } from './chat_channels.controller';
import { ChatChannelsService } from './chat_channels.service';

describe('ChatChannelsController', () => {
  let controller: ChatChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatChannelsController],
      providers: [ChatChannelsService],
    }).compile();

    controller = module.get<ChatChannelsController>(ChatChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
