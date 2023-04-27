import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';
import { FriendRequest, FriendStatus } from './entities/friend_request.entity';
import { CustomException } from 'src/utils/app.exception-filter';
import { ChatChannelMemberService } from 'src/chat_channel_member/chat_channel_member.service';
import { ChatChannelMember } from 'src/chat_channel_member/entities/chat_channel_member.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private readonly userService: UserService,
    private readonly chatChannelMemberService: ChatChannelMemberService,
  ) {}

  async alreadyFriends(
    requesterId: number,
    responderId: number,
  ): Promise<boolean> {
    const alreadyFriends = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.requester', 'requester')
      .leftJoinAndSelect('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :requesterId AND responder.id = :responderId) OR (requester.id = :responderId AND responder.id = :requesterId)',
        {
          requesterId: requesterId,
          responderId: responderId,
        },
      )
      .getMany();

    if (alreadyFriends.length === 0) return false;
    return true;
  }

  async findFriendRequestId(requesterId: number, responderId: number) {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.requester', 'requester')
      .leftJoinAndSelect('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :requesterId AND responder.id = :responderId) OR (requester.id = :responderId AND responder.id = :requesterId)',
        {
          requesterId: requesterId,
          responderId: responderId,
        },
      )
      .getOne();
    return friendRequest;
  }

  async create(requesterId: number, responderId: number) {
    try {
      const requester = await this.userService.findOne(requesterId);
      const responder = await this.userService.findOne(responderId);
      const createFriendRequestDto = new CreateFriendRequestDto();

      createFriendRequestDto.responder = responder;
      createFriendRequestDto.requester = requester;
      createFriendRequestDto.friendStatus = FriendStatus.PENDING;

      //idk how to set up unique constrains on both ends where requester and responder both cant be same
      //eg res = 10 and req = 11 || res = 11 and req = 10 should be marked as already friends
      if ((await this.alreadyFriends(requesterId, responderId)) === true) {
        throw new CustomException(
          `Friend Request to user already sent`,
          HttpStatus.BAD_REQUEST,
          'FriendRequest => create()',
        );
      }

      return await this.friendRequestRepository.save(createFriendRequestDto);
    } catch (error) {
      //if id not found for user or achievement (only when user is setup properly)
      if (error.name === 'CustomException') {
        throw new CustomException(
          `${error.response.message}`,
          HttpStatus.NOT_FOUND,
          'FriendRequest => create()',
        );
      } else {
        //if user and responder already friends (technically dont need this here
        //but incase better entity constrains come up im leaving this here)
        // throw new CustomException(
        //   `Friend Request to user already sent`,
        //   HttpStatus.BAD_REQUEST,
        //   'FriendRequest => create()',
        // );
      }
    }
  }

  async findAll() {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select(['friendRequest', 'requester', 'responder'])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .getMany();

    if (friendRequest === null) {
      throw new CustomException(
        `FriendRequest table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'FriendRequest => findOne()',
      );
    }

    return friendRequest;
  }

  async findOne(id: number) {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .where({ id: id })
      .select(['friendRequest', 'requester', 'responder'])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .getOne();

    if (friendRequest === null) {
      throw new CustomException(
        `FriendRequest with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'FriendRequest => findOne()',
      );
    }

    return friendRequest;
  }

  async findUserFriendRequests(id: number) {
    const friends = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select([
        'friendRequest.id',
        'friendRequest.createdAt',
        'friendRequest.friendStatus',
        'requester',
        'responder',
      ])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .where('(requester.id = :id OR responder.id = :id)', {
        id: id,
      })
      .getMany();

    //filtering out the requested and responder from the object to make it easier for front end
    const filteredFriends = friends.map((friend) => {
      const friendUser =
        friend.requester.id === id ? friend.responder : friend.requester;
      delete friend.responder;
      delete friend.requester;
      return {
        friendRequest: friend,
        friend: friendUser,
      };
    });

    return filteredFriends;
  }

  async findUserFriends(id: number) {
    const friends = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select([
        'friendRequest.id',
        'friendRequest.createdAt',
        'friendRequest.friendStatus',
        'requester',
        'responder',
      ])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :id OR responder.id = :id) AND friendRequest.friendStatus = :friendStatus',
        { id: id, friendStatus: FriendStatus.ACCEPTED },
      )
      .getMany();

    //filtering out the requested and responder from the object to make it easier for front end
    const filteredFriends = friends.map((friend) => {
      const friendUser =
        friend.requester.id === id ? friend.responder : friend.requester;
      delete friend.responder;
      delete friend.requester;
      return {
        friendRequest: friend,
        friend: friendUser,
      };
    });

    return filteredFriends;
  }

  async findUserPendingRequests(id: number) {
    const friendRequests = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select([
        'friendRequest.id',
        'friendRequest.createdAt',
        'friendRequest.friendStatus',
        'requester',
        'responder',
      ])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :id OR responder.id = :id) AND friendRequest.friendStatus = :friendStatus',
        { id: id, friendStatus: FriendStatus.PENDING },
      )
      .getMany();

    const res: {
      incomingRequests: Partial<FriendRequest>[];
      outgoingRequests: Partial<FriendRequest>[];
    } = friendRequests.reduce(
      (acc, friendRequest) => {
        if (friendRequest.responder.id === id) {
          //i am the responder
          const friendUser: User = friendRequest.requester;
          acc.incomingRequests.push({
            friendRequest: friendRequest,
            friend: friendUser,
          });
        } else if (friendRequest.requester.id === id) {
          //i am the requester
          const friendUser: User = friendRequest.responder;
          acc.outgoingRequests.push({
            friendRequest: friendRequest,
            friend: friendUser,
          });
        }
        delete friendRequest.requester;
        delete friendRequest.responder;
        return acc;
      },
      { incomingRequests: [], outgoingRequests: [] },
    );

    return res;
  }

  async findUserBlockedFriends(id: number) {
    const friends = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select([
        'friendRequest.id',
        'friendRequest.createdAt',
        'friendRequest.friendStatus',
        'requester',
        'responder',
      ])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :id OR responder.id = :id) AND friendRequest.friendStatus = :friendStatus',
        { id: id, friendStatus: FriendStatus.BLOCKED },
      )
      .getMany();

    //filtering out the requested and responder from the object to make it easier for front end
    const filteredFriends = friends.map((friend) => {
      const friendUser =
        friend.requester.id === id ? friend.responder : friend.requester;
      delete friend.responder;
      delete friend.requester;
      return {
        friendRequest: friend,
        friend: friendUser,
      };
    });

    return filteredFriends;
  }

  async findUserFriendsWithDirectMessage(id: number) {
    const friends = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select([
        'friendRequest.id',
        'friendRequest.createdAt',
        'friendRequest.friendStatus',
        'requester',
        'responder',
      ])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .where(
        '(requester.id = :id OR responder.id = :id) AND friendRequest.friendStatus = :friendStatus',
        { id: id, friendStatus: FriendStatus.ACCEPTED },
      )
      .getMany();

    //filtering out the requested and responder from the object to make it easier for front end
    const filteredFriends = Promise.all(
      friends.map(async (friend) => {
        const friendUser =
          friend.requester.id === id ? friend.responder : friend.requester;
        delete friend.responder;
        delete friend.requester;
        let directMessage: ChatChannelMember;

        try {
          directMessage =
            await this.chatChannelMemberService.findUserChatWithFriend(
              id,
              friendUser.id,
            );
        } catch (error) {
          //Might not need this if i just instatianlize every user to hae a direct message when accepted friendRequest
          directMessage = null;
        }

        return {
          friendRequest: friend,
          friend: friendUser,
          directMessage: directMessage,
        };
      }),
    );

    return filteredFriends;
  }

  async updateByFriendId(
    userId: number,
    friendId: number,
    friendStatus: FriendStatus,
  ) {
    const updateFriendRequestDto = new UpdateFriendRequestDto();
    updateFriendRequestDto.friendStatus = friendStatus;

    const friendRequestById = await this.findFriendRequestId(userId, friendId);
    if (friendRequestById === null) {
      throw new CustomException(
        `User with id = [${friendId}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'FriendRequest => updateByFriendId()',
      );
    }
    const id = friendRequestById.id;

    const friendRequest = await this.friendRequestRepository.update(
      id,
      updateFriendRequestDto,
    );

    if (friendRequest.affected === 0) {
      throw new CustomException(
        `FriendRequest with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'FriendRequest => updateByFriendId()',
      );
    }

    friendRequest.raw = await this.findOne(id);
    return friendRequest;
  }

  async update(id: number, friendStatus: FriendStatus) {
    const updateFriendRequestDto = new UpdateFriendRequestDto();
    updateFriendRequestDto.friendStatus = friendStatus;

    const friendRequest = await this.friendRequestRepository.update(
      id,
      updateFriendRequestDto,
    );

    if (friendRequest.affected === 0) {
      throw new CustomException(
        `FriendRequest with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'FriendRequest => remove()',
      );
    }
    friendRequest.raw = await this.findOne(id);
    return friendRequest;
  }

  async removeFriendRequestByFriendId(userId: number, friendId: number) {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .delete()
      .from(FriendRequest)
      .returning('*')
      .where(
        '(requester.id = :userId OR responder.id = :userId) AND (requester.id = :friendId OR responder.id = :friendId)',
        { userId: userId, friendId: friendId },
      )
      .execute();

    if (friendRequest.affected === 0) {
      throw new CustomException(
        `User with id = [${userId}] and friend with id = [${friendId}] were not friends`,
        HttpStatus.BAD_REQUEST,
        'FriendRequest => removeFriendRequestByFriendId()',
      );
    }

    return friendRequest;
  }

  async remove(id: number) {
    const friendRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .delete()
      .from(FriendRequest)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (friendRequest.affected === 0) {
      throw new CustomException(
        `FriendRequest with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'FriendRequest => remove()',
      );
    }

    return friendRequest;
  }
}
