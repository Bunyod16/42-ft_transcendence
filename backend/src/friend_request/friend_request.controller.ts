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
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { FriendStatus } from './entities/friend_request.entity';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { CustomException } from 'src/utils/app.exception-filter';
import { ChatChannelMemberService } from 'src/chat_channel_member/chat_channel_member.service';
import { UserService } from 'src/user/user.service';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private readonly friendRequestService: FriendRequestService,
    private readonly chatChannelMemberService: ChatChannelMemberService,
    private readonly userService: UserService,
    private readonly chatChannelsService: ChatChannelsService,
  ) {}

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

  @Post('/testing')
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

  @Post('/addFriendByNickName')
  @UseGuards(UserAuthGuard)
  async createByNickName(@Req() req: any, @Body('nickName') nickName: string) {
    const userId: number = req.user.id;
    const friendId: number = (
      await this.userService.findOneByUsername(nickName)
    ).id;

    const friendRequest = await this.friendRequestService.create(
      userId,
      friendId,
    );

    Logger.log(
      `Created FriendRequest with id = [${friendRequest.id}]`,
      'FriendRequest => createByNickName()',
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

  @UseGuards(UserAuthGuard)
  @Get('/findUserFriendRequests')
  async findUserFriendRequests(@Req() req: any) {
    const userId = req.user.id;
    const friends = await this.friendRequestService.findUserFriendRequests(
      userId,
    );

    Logger.log(
      `Trying to get all friendRequests for user with with id = [${userId}]`,
      'FriendStatus => findUserFriendRequests()',
    );

    return friends;
  }

  @UseGuards(UserAuthGuard)
  @Get('/findUserPendingRequest')
  async findUserPendingRequest(@Req() req: any) {
    const userId = req.user.id;
    const pendingRequests =
      await this.friendRequestService.findUserPendingRequests(userId);

    Logger.log(
      `Trying to get all pending request for user with with id = [${userId}]`,
      'FriendStatus => findUserPendingRequests()',
    );

    return pendingRequests;
  }

  @UseGuards(UserAuthGuard)
  @Get('/findUserBlockedFriends')
  async findUserBlockedFriends(@Req() req: any) {
    const userId = req.user.id;
    const pendingRequests =
      await this.friendRequestService.findUserBlockedFriends(userId);

    Logger.log(
      `Trying to get all blocked request for user with with id = [${userId}]`,
      'FriendStatus => findUserBlockedFriends()',
    );

    return pendingRequests;
  }

  @UseGuards(UserAuthGuard)
  @Get('/findUserFriendsWithDirectMessage')
  async findUserFriendsWithDirectMessage(@Req() req: any) {
    const userId = req.user.id;
    const friends =
      await this.friendRequestService.findUserFriendsWithDirectMessage(userId);

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

  @Get(':userId/findUserFriendsWithDirectMessageTesting')
  async findUserFriendsWithDirectMessageTesting(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const friends =
      await this.friendRequestService.findUserFriendsWithDirectMessage(userId);

    return friends;
  }

  @UseGuards(UserAuthGuard)
  @Patch('/updateByFriendId')
  async updateByFriendId(
    @Req() req: any,
    @Body('friendId', ParseIntPipe) friendId: number,
    @Body('friendStatus') friendshipStatus: string,
  ) {
    const userId = req.user.id;
    friendshipStatus = friendshipStatus.toLowerCase();
    if (
      !Object.values(FriendStatus).includes(
        friendshipStatus as string as FriendStatus,
      )
    ) {
      throw new CustomException(
        `Bad Request: Invalid Friendship Status`,
        HttpStatus.BAD_REQUEST,
        `FriendRequest => update()`,
      );
    }

    const friendRequest = await this.friendRequestService.updateByFriendId(
      userId,
      friendId,
      friendshipStatus as FriendStatus,
    );

    Logger.log(
      `User with id = [${userId}] updated their friendshipStatus with friend with id = [${friendId}] to [${friendshipStatus}]`,
      'FriendRequest => updateByFriendId()',
    );

    //if friendRequest is accepted create directmessage
    if (friendshipStatus === FriendStatus.ACCEPTED) {
      const hasChat =
        await this.chatChannelMemberService.checkIfUserHasChatWithFriend(
          userId,
          friendId,
        );
      Logger.log(
        `User with id = [${userId}] already has a direct message with friend with id = [${friendId}]`,
        'FriendRequest => updateByFriendId()',
      );
      if (hasChat === false) {
        await this.chatChannelsService.create_direct_message(userId, friendId);
        Logger.log(
          `User with id = [${userId}] created a directmessage with friend with id = [${friendId}]`,
          'FriendRequest => updateByFriendId()',
        );
      }
    }

    return friendRequest;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('friendStatus') friendshipStatus: string,
  ) {
    friendshipStatus = friendshipStatus.toLowerCase();
    if (
      !Object.values(FriendStatus).includes(
        friendshipStatus as string as FriendStatus,
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
      friendshipStatus as FriendStatus,
    );

    return friendRequest;
  }

  @UseGuards(UserAuthGuard)
  @Delete('/deleteFriendRequestByFriendId')
  async removeFriendRequestById(
    @Req() req: any,
    @Body('friendId', ParseIntPipe) friendId: number,
  ) {
    const userId = req.user.id;
    return this.friendRequestService.removeFriendRequestByFriendId(
      userId,
      friendId,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.friendRequestService.remove(id);
  }
}
