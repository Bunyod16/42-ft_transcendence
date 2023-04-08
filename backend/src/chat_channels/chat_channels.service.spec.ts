import { Test, TestingModule } from '@nestjs/testing';
import { ChatChannelsService } from './chat_channels.service';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { Repository } from 'typeorm';
import { ChatChannel } from './entities/chat_channel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const testNormalDto = new CreateChatChannelDto();

describe('ChatChannelsService', () => {
  let service: ChatChannelsService;
  let repo: Repository<ChatChannel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatChannelsService,
        {
          provide: getRepositoryToken(ChatChannel),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChatChannelsService>(ChatChannelsService);
    repo = module.get<Repository<ChatChannel>>(getRepositoryToken(ChatChannel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
