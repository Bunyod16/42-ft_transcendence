import { Injectable } from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';

@Injectable()
export class ChatChannelsService {
  create(createChatChannelDto: CreateChatChannelDto) {
    return 'This action adds a new chatChannel';
  }

  findAll() {
    return `This action returns all chatChannels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatChannel`;
  }

  update(id: number, updateChatChannelDto: UpdateChatChannelDto) {
    return `This action updates a #${id} chatChannel`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatChannel`;
  }
}
