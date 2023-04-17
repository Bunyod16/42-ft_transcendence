import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendStatus } from './entities/friend_request.entity';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { CustomException } from 'src/utils/app.exception-filter';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  async create(
    @Req() req: any,
    @Body('responderId', ParseIntPipe) responderId: any,
  ) {
    const requesterId: number = req.user.id;
    const friendRequest = await this.friendRequestService.create(
      requesterId,
      responderId,
    );

    Logger.log(
      `Created FriendRequest with id = [${friendRequest.id}]`,
      'FriendRequest => create()',
    );

    return friendRequest;
  }

  @Post('/manual')
  async createManual(
    @Body('requesterId', ParseIntPipe) requesterId: any,
    @Body('responderId', ParseIntPipe) responderId: any,
  ) {
    const friendRequest = await this.friendRequestService.create(
      requesterId,
      responderId,
    );

    Logger.log(
      `Created FriendRequest with id = [${friendRequest.id}]`,
      'FriendRequest => create()',
    );

    return friendRequest;
  }

  @Get()
  async findAll() {
    const friendRequest = this.friendRequestService.findAll();

    Logger.log(`Trying to get all friendRequest`, 'FriendStatus => findAll()');

    return friendRequest;
  }

  @UseGuards(UserAuthGuard)
  @Get('/findUserFriends')
  async findUserFriends(@Req() req: any) {
    const userId = req.user.id;
    const friends = await this.friendRequestService.findUserFriends(userId);

    Logger.log(
      `Trying to get all friends for user with with id = [${userId}]`,
      'FriendStatus => findUserFriends()',
    );

    return friends;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const friendRequest = await this.friendRequestService.findOne(id);

    Logger.log(
      `Trying to get friendRequest with id = [${id}]`,
      'FriendStatus => findOne()',
    );

    return friendRequest;
  }

  @Get(':userId/findUserFriendsTesting')
  async findUserFriendsTesting(@Param('userId', ParseIntPipe) userId: number) {
    const friends = await this.friendRequestService.findUserFriends(userId);

    return friends;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('friendStatus') friendship_status: string,
  ) {
    friendship_status = friendship_status.toLowerCase();
    if (
      !Object.values(FriendStatus).includes(
        friendship_status as string as FriendStatus,
      )
    ) {
      throw new CustomException(
        `Bad Request: Invalid Friendship Status`,
        HttpStatus.BAD_REQUEST,
        `FriendRequest => update()`,
      );
    }

    const friendRequest = await this.friendRequestService.update(
      id,
      friendship_status as FriendStatus,
    );

    return friendRequest;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.friendRequestService.remove(id);
    // try {
    //   const friendship_raw = await this.friendRequestService.findOne(id);
    //   const friend_request = await this.friendRequestService.remove(id);
    //
    //   Logger.log(
    //     `Trying to delete friendRequest with id = [${id}]`,
    //     'FriendRequest => remove()',
    //   );
    //
    //   if (!friend_request || friend_request.affected === 0) {
    //     Logger.log(
    //       `FriendRequest with id = [${id}] doeesn't exist`,
    //       'FriendRequest => remove()',
    //     );
    //     throw new HttpException(
    //       `Bad Request: User Achivement doesn't exist`,
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    //   Logger.log(
    //     `Deleted match with id = [${id}]`,
    //     'FriendRequest => remove()',
    //   );
    //
    //   friend_request.raw = friendship_raw;
    //   return friend_request;
    // } catch (error) {
    //   Logger.error(error, `FriendRequest => remove()`);
    //   throw new HttpException(
    //     `Internal Server Error: Some bad shit happened`,
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
