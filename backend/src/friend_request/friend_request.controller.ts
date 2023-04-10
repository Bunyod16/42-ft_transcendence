import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { CreateFriendRequestDto } from './dto/create-friend_request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend_request.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { FriendRequest, FriendStatus } from './entities/friend_request.entity';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private readonly friendRequestService: FriendRequestService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const requester_id: number = body.requesterId;
    const responder_id: number = body.responderId;

    const requester: User = await this.userService.findOne(requester_id);
    const responder: User = await this.userService.findOne(responder_id);

    console.log(requester, responder);

    if (!requester || !responder) {
      Logger.log(
        `Bad Request: user(s) with id = [${[
          requester_id,
          responder_id,
        ]}] doesn't exist`,
        'FriendRequest => create()',
      );
      throw new HttpException(
        `Bad Request: user(s) with id = [${[
          requester_id,
          responder_id,
        ]}] doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //check if two friends already have friend request:
    // if so check if rejected
    //  do something
    // else
    //  throw error already sent request

    // const users: User[] = await this.userService.findMany([
    //   requester_id,
    //   responder_id,
    // ]);
    //
    // if (users.length !== 2) {
    //   Logger.log(
    //     `Bad Request: user(s) with id = [${[
    //       requester_id,
    //       responder_id,
    //     ]}] doesn't exist`,
    //     'FriendRequest => create()',
    //   );
    //   throw new HttpException(
    //     `Bad Request: user(s) with id = [${[
    //       requester_id,
    //       responder_id,
    //     ]}] doesn't exist`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    try {
      const createFriendRequestDto: CreateFriendRequestDto =
        new CreateFriendRequestDto();

      createFriendRequestDto.requester = requester;
      createFriendRequestDto.responder = responder;
      createFriendRequestDto.friendStatus = FriendStatus.PENDING;

      const friendRequest = await this.friendRequestService.create(
        createFriendRequestDto,
      );

      Logger.log(
        `Created friendRequest with id = [${friendRequest.id}]`,
        'friendRequest => create()',
      );
      return friendRequest;
    } catch (error) {
      Logger.error(error, `friendRequest => create()`);
      throw new HttpException(
        `Bad Request: Friend Request already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    const friendRequest = this.friendRequestService.findAll();

    // Logger.log(`Trying to get all friendRequest`, 'FriendStatus => findAll()');
    //
    // if (!friendRequest) {
    //   Logger.log(`Cant find friendRequest table`, 'FriendStatus => findAll()');
    //   throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    // }

    return friendRequest;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const friendRequest = await this.friendRequestService.findOne(id);

    Logger.log(
      `Trying to get friendRequest with id = [${id}]`,
      'FriendStatus => findOne()',
    );

    if (!friendRequest) {
      Logger.log(
        `friendRequest with id = [${id}] doeesn't exist`,
        'FriendStatus => findOne()',
      );
      throw new HttpException(
        `Not Found: FriendStatus doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    return friendRequest;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('friendStatus') friendship_status: string,
  ) {
    const frindship_request: FriendRequest =
      await this.friendRequestService.findOne(id);

    if (frindship_request === null) {
      Logger.log(
        `friendRequest with id = [${id}] doesn't exist`,
        `friendRequest => updateText()`,
      );
      throw new HttpException(
        `Bad Request: FriendRequest doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    friendship_status = friendship_status.toLowerCase();
    if (
      !Object.values(FriendStatus).includes(
        friendship_status as string as FriendStatus,
      )
    ) {
      throw new HttpException(
        `Bad Request: Invalid Friendship Status`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updateFriendRequestDto: UpdateFriendRequestDto =
        new UpdateFriendRequestDto();

      //check if two friends already have friend request:
      // if so check if rejected
      //  do something
      // else
      //  throw error already sent request
      updateFriendRequestDto.friendStatus = friendship_status as FriendStatus;

      const res = await this.friendRequestService.update(
        id,
        updateFriendRequestDto,
      );

      res.raw = await this.friendRequestService.findOne(id);
      return res;
    } catch (error) {
      Logger.error(error, `FriendshipRequest => update()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const friendship_raw = await this.friendRequestService.findOne(id);
      const friend_request = await this.friendRequestService.remove(id);

      Logger.log(
        `Trying to delete friendRequest with id = [${id}]`,
        'FriendRequest => remove()',
      );

      if (!friend_request || friend_request.affected === 0) {
        Logger.log(
          `UserAchievement with id = [${id}] doeesn't exist`,
          'FriendRequest => remove()',
        );
        throw new HttpException(
          `Bad Request: User Achivement doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      Logger.log(
        `Deleted match with id = [${id}]`,
        'FriendRequest => remove()',
      );

      friend_request.raw = friendship_raw;
      return friend_request;
    } catch (error) {
      Logger.error(error, `FriendRequest => remove()`);
      throw new HttpException(
        `Internal Server Error: Some bad shit happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
