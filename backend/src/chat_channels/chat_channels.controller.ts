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
} from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';
import { ApiTags } from '@nestjs/swagger';
import RequestWithUser from 'src/auth/requestWithUser.interace';
import { UserAuthGuard } from 'src/auth/auth.guard';

@ApiTags('chat-channels')
@UseGuards(UserAuthGuard)
@Controller('chat-channels')
export class ChatChannelsController {
  constructor(private readonly chatChannelsService: ChatChannelsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(@Body('name') channelName: string, @Req() request) {
    return this.chatChannelsService.create(channelName, request.user.id);
  }

  @Get()
  async findAll() {
    const chatChannel = await this.chatChannelsService.findAll();

    Logger.log(`Trying to get all chatChannel`, 'chatChannel => findAll()');

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
    @Param('id') id: string,
    @Body() updateChatChannelDto: UpdateChatChannelDto,
  ) {
    return this.chatChannelsService.update(+id, updateChatChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatChannelsService.remove(+id);
  }
}
