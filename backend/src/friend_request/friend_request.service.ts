import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async create(
    createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<CreateFriendRequestDto & FriendRequest> {
    return this.friendRequestRepository.save(createFriendRequestDto);
  }

  async findAll() {
    return this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .select(['friendRequest', 'requester', 'responder'])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .getMany();
  }

  async findOne(id: number) {
    return this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .where({ id: id })
      .select(['friendRequest', 'requester', 'responder'])
      .leftJoin('friendRequest.requester', 'requester')
      .leftJoin('friendRequest.responder', 'responder')
      .getOne();
  }

  async update(id: number, updateFriendRequestDto: UpdateFriendRequestDto) {
    return this.friendRequestRepository.update(id, updateFriendRequestDto);
  }

  async remove(id: number) {
    return this.friendRequestRepository.delete(id);
  }
}
