import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestController } from './friend_request.controller';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

const moduleMocker = new ModuleMocker(global);
const testUser = new CreateUserDto();
testUser.wins = 0;
testUser.losses = 10;
testUser.nickName = 'nazrin';
testUser.online = true;

const testUser2 = new CreateUserDto();
testUser.wins = 10;
testUser.losses = 2;
testUser.nickName = 'not nazrin';
testUser.online = false;

describe('FriendRequestController', () => {
  let controller: FriendRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestController],
    })
      .useMocker((token) => {
        // const results = [
        //   {
        //     friendStatus: FriendStatus.PENDING,
        //     requester: testUser,
        //     respoonder: testUser2,
        //   },
        // ];

        const results = ['test', 'test2'];

        console.log(token);
        if (token === ChatChannelsService) {
          // console.log('HELLO');
          // console.log({ findAll: jest.fn().mockResolvedValue(results) });
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token == 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<FriendRequestController>(FriendRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFriendRequests', () => {
    it('should get all FriendRequests', async () => {
      console.log(await controller.findAll());
      // await expect(controller.findAll()).resolves.toEqual([
      //   {
      //     friendStatus: FriendStatus.PENDING,
      //     requester: testUser,
      //     respoonder: testUser2,
      //   },
      // ]);
    });
  });
});
