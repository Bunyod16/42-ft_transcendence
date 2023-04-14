import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelMemberService } from './chat_channel_member.service';

describe('ChatChannelMemberService', () => {
  let service: ChatChannelMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatChannelMemberService],
    }).compile();

    service = module.get<ChatChannelMemberService>(ChatChannelMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
