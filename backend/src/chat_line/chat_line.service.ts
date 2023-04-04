import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CustomException } from 'src/utils/app.exception-filter';
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

  async create(text: string, channel_id: number) {
    const chatLine: CreateChatLineDto = new CreateChatLineDto();

    //find chat Channel and handle accordingly
    // this.chatChannelService.findOne(channel_id);

    chatLine.text = text;

    return await this.chatLineRepository.save(chatLine);
  }

  async findAll() {
    return await this.chatLineRepository
      .createQueryBuilder('chatLine')
      .select(['chatLine'])
      .getMany();
  }

  async findOne(id: number) {
    const chatLine = await this.chatLineRepository
      .createQueryBuilder('chatLine')
      .where({ id: id })
      .select(['chatLine'])
      .getOne();

    if (chatLine === null) {
      throw new CustomException(
        `ChatLine with id = [${id}] doesn't exist test`,
        HttpStatus.NOT_FOUND,
        'ChatLine => remove()',
      );
    }

    return chatLine;
  }

  async update(id: number, updateChatLineDto: UpdateChatLineDto) {
    const chatLine = await this.chatLineRepository.update(
      id,
      updateChatLineDto,
    );

    if (chatLine.affected === 1) {
      return chatLine;
    } else {
      throw new CustomException(
        `ChatLine with id = [${id}] doesn't exist test`,
        HttpStatus.NOT_FOUND,
        'ChatLine => remove()',
      );
    }
  }

  async remove(id: number) {
    const chatLine = await this.chatLineRepository
      .createQueryBuilder('chatLine')
      .delete()
      .from(ChatLine)
      .where('id = :id', { id: id })
      .returning('*')
      .execute();

    if (chatLine.affected === 1) {
      return chatLine;
    } else {
      throw new CustomException(
        `ChatLine with id = [${id}] doesn't exist test`,
        HttpStatus.NOT_FOUND,
        'ChatLine => remove()',
      );
    }
  }
}