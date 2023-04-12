import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';
import { Repository } from 'typeorm';
import { ChannelType, ChatChannel } from './entities/chat_channel.entity';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/utils/app.exception-filter';

@Injectable()
export class ChatChannelsService {
  constructor(
    @InjectRepository(ChatChannel)
    private chatChannelRepository: Repository<ChatChannel>,
  ) {}

  async create(channelName: string, ownerId: number) {
    const channel = new ChatChannel();

    //default chatChannel settings
    channel.channel_type = ChannelType.PUBLIC;
    channel.ownerId = ownerId;
    channel.name = channelName;
    channel.password = undefined;

    const errors = await validate(channel);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      throw new CustomException(
        `Some Bad Shit Happened`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `ChatChannel => create()`,
      );
    }

    const savedChannel = await this.chatChannelRepository.save(channel);
    return savedChannel;
  }

  async findAll() {
    const chatChannels = await this.chatChannelRepository
      .createQueryBuilder('chatChannels')
      .select(['chatChannels'])
      .getMany();

    if (chatChannels === null) {
      throw new CustomException(
        `ChatChannels table doesn't exist`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'ChatChannels => findOne()',
      );
    }

    return chatChannels;
  }

  async findOne(id: number): Promise<ChatChannel> {
    const chatChannel = await this.chatChannelRepository
      .createQueryBuilder('chatChannel')
      .where({ id: id })
      .select('chatChannel')
      .getOne();

    if (chatChannel === null) {
      throw new CustomException(
        `chatChannels with id = [${id}] doesn't exist`,
        HttpStatus.NOT_FOUND,
        'chatChannels => findOne()',
      );
    }

    return chatChannel;
  }

  async update(id: number, updateChannelDto: UpdateChatChannelDto) {
    if (
      updateChannelDto.channel_type == ChannelType.PROTECTED &&
      updateChannelDto.password == null
    )
      throw new HttpException(
        'Update channel type protected must have password',
        HttpStatus.BAD_REQUEST,
      );
    console.log(updateChannelDto);
    const savedChannel = await this.chatChannelRepository.update(
      { id: id },
      updateChannelDto,
    );
    console.log(savedChannel);
    return savedChannel;
  }

  remove(id: number) {
    return this.chatChannelRepository.delete(id);
  }
}

//TODO: check if user is updating the channel where they are the owner
