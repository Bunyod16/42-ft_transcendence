import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';
import { Repository } from 'typeorm';
import { ChannelType, ChatChannel } from './entities/chat_channel.entity';
import { validate } from 'class-validator';

@Injectable()
export class ChatChannelsService {
  constructor(
    @Inject('CHAT_CHANNEL_REPOSITORY')
    private chatChannelRepository: Repository<ChatChannel>,
  ) {}

  async create(createChatChannelDto: CreateChatChannelDto, ownerId: number) {
    const channel = new ChatChannel();
    channel.channel_type = createChatChannelDto.channel_type;
    channel.ownerId = ownerId;
    channel.name = createChatChannelDto.name;
    channel.password = createChatChannelDto.password;

    const errors = await validate(channel);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
    } else {
      const savedChannel = await this.chatChannelRepository.save(channel);
      return savedChannel;
    }
  }

  async findAll() {
    return await this.chatChannelRepository.find();
  }

  async findOne(id: number): Promise<ChatChannel> {
    if (id == null)
      throw new HttpException(
        'Chat channel is undefined or not a number',
        HttpStatus.BAD_REQUEST,
      );
    return this.chatChannelRepository.findOneBy({
      id: id,
    });
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
