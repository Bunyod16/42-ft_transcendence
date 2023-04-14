import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelMemberController } from './chat_channel_member.controller';
import { ChatChannelMemberService } from './chat_channel_member.service';

describe('ChatChannelMemberController', () => {
  let controller: ChatChannelMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatChannelMemberController],
      providers: [ChatChannelMemberService],
    }).compile();

    controller = module.get<ChatChannelMemberController>(ChatChannelMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
