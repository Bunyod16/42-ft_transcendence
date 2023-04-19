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
import { ChatType } from 'src/chat_channels/entities/chat_channel.entity';

@Controller('chat-channel-member')
export class ChatChannelMemberController {
  constructor(
    private readonly chatChannelMemberService: ChatChannelMemberService,
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

  @Patch(':id/blacklisted')
  async update_blacklisted(
    @Param('id', ParseIntPipe) id: number,
    @Query('isBlacklisted', ParseBoolPipe) isBlacklisted: boolean,
  ) {
    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();
    updateChatChannelMemberDto.isBlacklisted = isBlacklisted;

    const chatChannelMember = await this.chatChannelMemberService.update(
      id,
      updateChatChannelMemberDto,
    );

    return chatChannelMember;
  }

  @Patch(':id/mute')
  async update_mute(
    @Param('id', ParseIntPipe) id: number,
    @Query('mutedUntil') mutedUntil: string,
  ) {
    //Date must be in ISO-8601 format
    const date: Date = mutedUntil ? new Date(mutedUntil) : null;

    //check if date is in invalid format
    if (isNaN(date.valueOf())) {
      throw new CustomException(
        `Invalid Date Format`,
        HttpStatus.BAD_REQUEST,
        'ChatChannelMember => update_muted()',
      );
    }

    const chatChannelMember = await this.chatChannelMemberService.update_muted(
      id,
      date,
    );

    return chatChannelMember;
  }

  @Patch(':id/unmute')
  async update_unmute(@Param('id', ParseIntPipe) id: number) {
    const updateChatChannelMemberDto = new UpdateChatChannelMemberDto();
    updateChatChannelMemberDto.mutedUntil = null;

    const chatChannelMember = await this.chatChannelMemberService.update(
      id,
      updateChatChannelMemberDto,
    );

    return chatChannelMember;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatChannelMemberService.remove(id);
  }
}
