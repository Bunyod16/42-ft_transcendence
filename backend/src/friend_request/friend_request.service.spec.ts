import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendRequestService } from './friend_request.service';

describe('FriendRequestService', () => {
  let service: FriendRequestService;
  let repo: Repository<FriendRequest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestService,
        {
          provide: getRepositoryToken(FriendRequest),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FriendRequestService>(FriendRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
