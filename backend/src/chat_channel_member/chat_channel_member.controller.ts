import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
  ParseBoolPipe,
  Query,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatChannelMemberService } from './chat_channel_member.service';
import { UpdateChatChannelMemberDto } from './dto/update-chat_channel_member.dto';
import { CustomException } from 'src/utils/app.exception-filter';
import { UserAuthGuard } from 'src/auth/auth.guard';
import {
  ChatChannel,
  ChatType,
} from 'src/chat_channels/entities/chat_channel.entity';
import { User } from 'src/user/entities/user.entity';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { ChatChannelMember } from './entities/chat_channel_member.entity';

const validateAction = (
  requester: User,
  receiverMember: ChatChannelMember,
  chatChannel: ChatChannel,
  isRequesterAdmin: boolean,
  action: string,
) => {
  //Entity is bugged out because OwnerId is type number and not type User. (too late dont fix)
  const owner: any = chatChannel.ownerId;

  //if not admin
  if (!isRequesterAdmin) {
    throw new CustomException(
      `Requester is not admin in ChatChannel`,
      HttpStatus.BAD_REQUEST,
    );
  }

  //if user try to ${action} themselves
  if (requester.id === receiverMember.user.id) {
    throw new CustomException(
      `User cannot ${action} themselves`,
      HttpStatus.BAD_REQUEST,
    );
  }

  //if admin trying to ${action} out owner
  if (receiverMember.user.id === owner.id) {
    throw new CustomException(
      `Admin cannot ${action} out owner`,
      HttpStatus.BAD_REQUEST,
    );
  }

  //if admin trying to ${action} out other admin
  if (
    receiverMember.isAdmin &&
    isRequesterAdmin &&
    !(requester.id === owner.id)
  ) {
    throw new CustomException(
      `Admin cannot ${action} out other admins`,
      HttpStatus.BAD_REQUEST,
    );
  }
};

@Controller('chat-channel-member')
export class ChatChannelMemberController {
  constructor(
    private readonly chatChannelMemberService: ChatChannelMemberService,
    private readonly chatChannelService: ChatChannelsService,
  ) {}

  @Post()
  async create(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const chatChannelMember = await this.chatChannelMemberService.create(
      userId,
      chatChannelId,
    );

    Logger.log(
      `Created ChatChannelMember with id = [${chatChannelMember.id}]`,
      'ChatChannelMember => create()',
    );

    return chatChannelMember;
  }

  @Post('protected')
  async createProtected(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
    @Body('password') password: string,
  ) {
    const chatChannelMember =
      await this.chatChannelMemberService.createProtected(
        userId,
        chatChannelId,
        password,
      );

    Logger.log(
      `Created ChatChannelMember with id = [${chatChannelMember.id}]`,
      'ChatChannelMember => create()',
    );

    return chatChannelMember;
  }

  @Get()
  async findAll() {
    const chatChannelMember = await this.chatChannelMemberService.findAll();

    Logger.log(
      `Trying to get all chatChannelMembers`,
      'ChatChannelMember => findAll()',
    );

    return chatChannelMember;
  }

  @UseGuards(UserAuthGuard)
  @Get('/userChatChannels')
  async findAllUserChatChannel(@Req() req: any) {
    const userId = req.user.id;
    const chatChannelMember =
      await this.chatChannelMemberService.findAllUserChatChannel(userId);

    Logger.log(
      `Trying to get ChatChannelMember with userId = [${userId}]`,
      'ChatChannelMember => findAllUsersInChatChannel()',
    );

    return chatChannelMember;
  }

  @UseGuards(UserAuthGuard)
  @Get('/usersDirectMessages')
  async findAllUsersDirectMessages(@Req() req: any) {
    const userId = req.user.id;
    const chatChannelMember =
      await this.chatChannelMemberService.findAllUsersChatChannelType(
        userId,
        ChatType.DIRECT_MESSAGE,
      );

    Logger.log(
      `Trying to get all Users Direct Messages with userId = [${userId}]`,
      'ChatChannelMember => findAllUsersInChatChannel()',
    );

    return chatChannelMember;
  }

  @UseGuards(UserAuthGuard)
  @Get('/usersGroupMessages')
  async findAllUsersGroupMessages(@Req() req: any) {
    const userId = req.user.id;
    const chatChannelMember =
      await this.chatChannelMemberService.findAllUsersChatChannelType(
        userId,
        ChatType.GROUP_MESSAGE,
      );

    Logger.log(
      `Trying to get Users Group Messages with userId = [${userId}]`,
      'ChatChannelMember => findAllUsersInChatChannel()',
    );

    return chatChannelMember;
  }

  @Get('/checkIfUserHasChatWithFriend')
  async checkIfUserHasChatWithFriend(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('friendId', ParseIntPipe) friendId: number,
  ) {
    const hasChat =
      await this.chatChannelMemberService.checkIfUserHasChatWithFriend(
        userId,
        friendId,
      );

    Logger.log(
      `Trying to see if userId = [${userId}] has chat with friendId = [${friendId}]`,
      'ChatChannelMember => checkIfUserHasChatWithFriend()',
    );

    return hasChat;
  }

  @Get(':chatChannelId/usersInChatChannel')
  async findAllUsersInChatChannel(
    @Param('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const chatChannelMember =
      await this.chatChannelMemberService.findAllUsersInChatChannel(
        chatChannelId,
      );

    Logger.log(
      `Trying to get all Users in ChatChannel with Id = [${chatChannelId}]`,
      'ChatChannelMember => findOne()',
    );

    return chatChannelMember;
  }

  @Get(':userId/userChatChannelsTesting')
  async findAllUserChatChannel_testing(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const chatChannelMember =
      await this.chatChannelMemberService.findAllUserChatChannel(userId);

    Logger.log(
      `Trying to get ChatChannelMember with userId = [${userId}]`,
      'ChatChannelMember => findOne()',
    );

    return chatChannelMember;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chatChannelMember = await this.chatChannelMemberService.findOne(id);

    Logger.log(
      `Trying to get ChatChannelMember with id = [${id}]`,
      'ChatChannelMember => findOne()',
    );

    return chatChannelMember;
  }

  @Patch(':id/admin')
  async update_admin(
    @Param('id', ParseIntPipe) id: number,
    @Query('isAdmin', ParseBoolPipe) isAdmin: boolean,
  ) {
    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();
    updateChatChannelMemberDto.isAdmin = isAdmin;

    const chatChannelMember = await this.chatChannelMemberService.update(
      id,
      updateChatChannelMemberDto,
    );

    return chatChannelMember;
  }

  @Patch(':chatChannelMemberId/blacklisted')
  @UseGuards(UserAuthGuard)
  async update_blacklisted(
    @Req() req: any,
    @Param('chatChannelMemberId', ParseIntPipe) chatChannelMemberId: number,
    @Body('isBlacklisted', ParseBoolPipe) isBlacklisted: boolean,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const requester: User = req.user;
    try {
      const userToDelete: ChatChannelMember =
        await this.chatChannelMemberService.findOne(chatChannelMemberId);
      const chatChannel: ChatChannel = await this.chatChannelService.findOne(
        chatChannelId,
      );
      const isRequesterAdmin: boolean =
        await this.chatChannelMemberService.isUserAdmin(
          requester.id,
          chatChannel.id,
        );
      validateAction(
        requester,
        userToDelete,
        chatChannel,
        isRequesterAdmin,
        'blacklist',
      );
    } catch (error) {
      throw new CustomException(
        `${error.response.message}`,
        HttpStatus.BAD_REQUEST,
        `ChatChannelMember => remove()`,
      );
    }

    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();
    updateChatChannelMemberDto.isBlacklisted = isBlacklisted;

    const chatChannelMember = await this.chatChannelMemberService.update(
      chatChannelMemberId,
      updateChatChannelMemberDto,
    );

    Logger.log(
      `Blacklisting ChatChannelMember with chatChannelMemberId = [${chatChannelMemberId}]`,
      `ChatChannelMember => update_blacklisted()`,
    );

    return chatChannelMember;
  }

  @Patch(':chatChannelMemberId/mute')
  @UseGuards(UserAuthGuard)
  async update_mute(
    @Req() req: any,
    @Param('chatChannelMemberId', ParseIntPipe) chatChannelMemberId: number,
    @Body('mutedUntil') mutedUntil: string,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    //Date must be in ISO-8601 format
    const date: Date = mutedUntil ? new Date(mutedUntil) : null;
    const requester: User = req.user;

    //check if date is in invalid format
    if (isNaN(date.valueOf())) {
      throw new CustomException(
        `Invalid Date Format`,
        HttpStatus.BAD_REQUEST,
        'ChatChannelMember => update_muted()',
      );
    }

    if (date < new Date()) {
      throw new CustomException(
        `Invalid Date`,
        HttpStatus.BAD_REQUEST,
        'ChatChannelMember => update_muted()',
      );
    }

    //Validate user rights in the channel before doing anything (defo better way to doing this)
    try {
      const userToDelete: ChatChannelMember =
        await this.chatChannelMemberService.findOne(chatChannelMemberId);
      const chatChannel: ChatChannel = await this.chatChannelService.findOne(
        chatChannelId,
      );
      const isRequesterAdmin: boolean =
        await this.chatChannelMemberService.isUserAdmin(
          requester.id,
          chatChannel.id,
        );
      validateAction(
        requester,
        userToDelete,
        chatChannel,
        isRequesterAdmin,
        'mute',
      );
    } catch (error) {
      throw new CustomException(
        `${error.response.message}`,
        HttpStatus.BAD_REQUEST,
        `ChatChannelMember => update_muted()`,
      );
    }

    const chatChannelMember = await this.chatChannelMemberService.update_muted(
      chatChannelMemberId,
      date,
    );

    Logger.log(
      `Muting ChatChannelMember with chatChannelMemberId = [${chatChannelMemberId}]`,
      `ChatChannelMember => update_muted()`,
    );

    return chatChannelMember;
  }

  @Patch(':chatChannelMemberId/unmute')
  @UseGuards(UserAuthGuard)
  async update_unmute(
    @Req() req: any,
    @Param('chatChannelMemberId', ParseIntPipe) chatChannelMemberId: number,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    const requester: User = req.user;

    try {
      const userToDelete: ChatChannelMember =
        await this.chatChannelMemberService.findOne(chatChannelMemberId);
      const chatChannel: ChatChannel = await this.chatChannelService.findOne(
        chatChannelId,
      );
      const isRequesterAdmin: boolean =
        await this.chatChannelMemberService.isUserAdmin(
          requester.id,
          chatChannel.id,
        );
      validateAction(
        requester,
        userToDelete,
        chatChannel,
        isRequesterAdmin,
        'mute',
      );
    } catch (error) {
      throw new CustomException(
        `${error.response.message}`,
        HttpStatus.BAD_REQUEST,
        `ChatChannelMember => update_muted()`,
      );
    }

    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();
    updateChatChannelMemberDto.mutedUntil = null;

    const chatChannelMember = await this.chatChannelMemberService.update(
      chatChannelMemberId,
      updateChatChannelMemberDto,
    );

    Logger.log(
      `Unmuting ChatChannelMember with chatChannelMemberId = [${chatChannelMemberId}]`,
      `ChatChannelMember => update_unmute()`,
    );

    return chatChannelMember;
  }

  @Delete('/byUserInChatChannel')
  async removeByUser(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    Logger.log(
      `Deleting ChatChannelMember with userId = [${userId}]`,
      `ChatChannelMember => delete()`,
    );

    return this.chatChannelMemberService.removeByUserInChatChannel(
      userId,
      chatChannelId,
    );
  }

  @Delete(':chatChannelMemberId')
  @UseGuards(UserAuthGuard)
  async remove(
    @Req() req: any,
    @Param('chatChannelMemberId', ParseIntPipe) chatChannelMemberId: number,
    @Body('chatChannelId', ParseIntPipe) chatChannelId: number,
  ) {
    Logger.log(
      `Deleting ChatChannelMember with chatChannelMemberId = [${chatChannelMemberId}]`,
      `ChatChannelMember => delete()`,
    );

    const requester: User = req.user;

    //Validate user rights in the channel before doing anything (defo better way to doing this)
    try {
      const userToDelete: ChatChannelMember =
        await this.chatChannelMemberService.findOne(chatChannelMemberId);
      const chatChannel: ChatChannel = await this.chatChannelService.findOne(
        chatChannelId,
      );
      const isRequesterAdmin: boolean =
        await this.chatChannelMemberService.isUserAdmin(
          requester.id,
          chatChannel.id,
        );
      validateAction(
        requester,
        userToDelete,
        chatChannel,
        isRequesterAdmin,
        'kick',
      );
    } catch (error) {
      throw new CustomException(
        `${error.response.message}`,
        HttpStatus.BAD_REQUEST,
        `ChatChannelMember => remove()`,
      );
    }

    return this.chatChannelMemberService.remove(chatChannelMemberId);
  }
}
