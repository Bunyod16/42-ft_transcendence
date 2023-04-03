import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateChatLineDto } from './dto/create-chat_line.dto';
import { UpdateChatLineDto } from './dto/update-chat_line.dto';
import { ChatLine } from './entities/chat_line.entity';

@Injectable()
export class ChatLineService {
  constructor(
    @Inject('CHAT_LINE_REPOSITORY')
    private chatLineRepository: Repository<ChatLine>,
  ) {}
  // private readonly chatChannelService: ChatChannelService,

  async create(createChatLineDto: CreateChatLineDto, channel_id: number) {
    //find chat Channel and handle accordingly
    // this.chatChannelService.findOne(chat_id);

    return this.chatLineRepository.save(createChatLineDto);
  }

  findAll() {
    return `This action returns all chatLine`;
  }

  async findOne(id: number) {
    return await this.chatLineRepository
      .createQueryBuilder('chatLine')
      .where({ id: id })
      .select(['chatLine'])
      .getOne();
  }

  update(id: number, updateChatLineDto: UpdateChatLineDto) {
    return `This action updates a #${id} chatLine`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatLine`;
  }
}
