import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatChannelsService } from './chat_channels.service';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';

@Controller('chat-channels')
export class ChatChannelsController {
  constructor(private readonly chatChannelsService: ChatChannelsService) {}

  @Post()
  create(@Body() createChatChannelDto: CreateChatChannelDto) {
    return this.chatChannelsService.create(createChatChannelDto);
  }

  @Get()
  findAll() {
    return this.chatChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatChannelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatChannelDto: UpdateChatChannelDto) {
    return this.chatChannelsService.update(+id, updateChatChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatChannelsService.remove(+id);
  }
}
