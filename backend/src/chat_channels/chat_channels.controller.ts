import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Logger,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { ChannelType } from './entities/chat_channel.entity';
import { CustomException } from 'src/utils/app.exception-filter';
import { User } from 'src/user/entities/user.entity';

@ApiTags('chat-channels')
@Controller('chat-channels')
export class ChatChannelsController {
  constructor(private readonly chatChannelsService: ChatChannelsService) {}

  @Post('/groupMessage')
  @UseGuards(UserAuthGuard)
  async create_group_message(
    @Body('name') channelName: string,
    @Req() request: any,
  ) {
    const chatChannel = await this.chatChannelsService.create_group_message(
      channelName,
      request.user.id,
    );

    Logger.log(
      `Created ChatChannel with id = [${chatChannel.id}]`,
      'ChatChannel => create()',
    );

    return chatChannel;
  }

  @Post('/protectedGroupMessage')
  @UseGuards(UserAuthGuard)
  async create_protected_group_message(
    @Body('name') channelName: string,
    @Body('password') channelPassword: string,
    @Req() request: any,
  ) {
    const chatChannel =
      await this.chatChannelsService.create_protected_group_message(
        channelName,
        channelPassword,
        request.user.id,
      );

    Logger.log(
      `Created ChatChannel with id = [${chatChannel.id}]`,
      'ChatChannel => create()',
    );

    return chatChannel;
  }

  @Post('/groupMessageTesting')
  async create_group_message_testing(
    @Body('name') channelName: string,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chatChannel = await this.chatChannelsService.create_group_message(
      channelName,
      userId,
    );

    Logger.log(
      `Created ChatChannel with id = [${chatChannel.id}]`,
      'ChatChannel => create()',
    );

    return chatChannel;
  }

  @Post('/directMessage')
  @UseGuards(UserAuthGuard)
  async create_direct_message(
    @Req() req: any,
    @Body('recipientId', ParseIntPipe) recipientId: number,
  ) {
    const chatChannel = await this.chatChannelsService.create_direct_message(
      req.user.id,
      recipientId,
    );

    Logger.log(
      `Created ChatChannel with id = [${chatChannel.id}]`,
      'ChatChannel => create()',
    );

    return chatChannel;
  }

  @Post('/directMessageTesting')
  async create_direct_message_testing(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('recipientId', ParseIntPipe) recipientId: number,
  ) {
    const chatChannel = await this.chatChannelsService.create_direct_message(
      userId,
      recipientId,
    );

    Logger.log(
      `Created ChatChannel with id = [${chatChannel.id}]`,
      'ChatChannel => create()',
    );

    return chatChannel;
  }

  @Get()
  async findAll() {
    const chatChannel = await this.chatChannelsService.findAll();

    Logger.log(`Trying to get all chatChannel`, 'chatChannel => findAll()');

    return chatChannel;
  }

  @Get('/findAllPublicAndProtectedChannels')
  async findAllPublicAndProtectedChannels() {
    const chatChannel =
      await this.chatChannelsService.findAllPublicAndProtectedChannels();

    Logger.log(
      `Trying to get all Public and Protected chatChannels`,
      'chatChannel => findAllPublicAndProtectedChannels()',
    );

    return chatChannel;
  }

  @Get('/findAllPublicChannelsThatUserIsNotIn')
  @UseGuards(UserAuthGuard)
  async findAllPublicChannelsThatUserIsNotIn(@Req() req: any) {
    const user: User = req.user;

    const chatChannel =
      await this.chatChannelsService.findAllPublicChannelsThatUserIsNotIn(
        user.id,
      );

    Logger.log(
      `Trying to get all Public chatChannels that User is not in`,
      'chatChannel => findAllPublicAndProtectedChannels()',
    );

    return chatChannel;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chatChannel = await this.chatChannelsService.findOne(id);

    Logger.log(
      `Trying to get ChatChannel with id = [${id}]`,
      'ChatChannel => findOne()',
    );

    return chatChannel;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('channelType') channelType?: string,
    @Body('password') password?: string,
    @Body('name') name?: string,
  ) {
    //validate channelType is actually a valid enum
    if (typeof channelType !== 'undefined') {
      channelType = channelType.toLowerCase();
      if (
        !Object.values(ChannelType).includes(
          channelType as string as ChannelType,
        )
      ) {
        throw new CustomException(
          `Bad Request: Invalid ChannelType Status`,
          HttpStatus.BAD_REQUEST,
          `ChatChannel => update()`,
        );
      }
    }

    return this.chatChannelsService.update(
      id,
      channelType as ChannelType,
      password,
      name,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatChannelsService.remove(id);
  }
}
