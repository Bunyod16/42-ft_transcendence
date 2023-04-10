import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';
import { FriendRequest, FriendStatus } from './entities/friend_request.entity';
import { CustomException } from 'src/utils/app.exception-filter';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private readonly userService: UserService,
  ) {}

  async create(requesterId: number, responderId: number) {
    try {
      const requester = await this.userService.findOne(requesterId);
      const responder = await this.userService.findOne(responderId);
      const createFriendRequestDto = new CreateFriendRequestDto();

      createFriendRequestDto.responder = responder;
      createFriendRequestDto.requester = requester;
      createFriendRequestDto.friendStatus = FriendStatus.PENDING;

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
        //if user and responder already friends
        throw new CustomException(
          `Friend Request to user already sent`,
          HttpStatus.BAD_REQUEST,
          'FriendRequest => create()',
        );
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
