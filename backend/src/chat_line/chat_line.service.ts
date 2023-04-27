import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/utils/app.exception-filter';
import { Repository } from 'typeorm';
import { CreateChatLineDto } from './dto/create-chat_line.dto';
import { UpdateChatLineDto } from './dto/update-chat_line.dto';
import { ChatLine } from './entities/chat_line.entity';
import { ChatChannelsService } from 'src/chat_channels/chat_channels.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatLineService {
  constructor(
    @InjectRepository(ChatLine)
    private chatLineRepository: Repository<ChatLine>,
    private readonly chatChannelService: ChatChannelsService,
  ) {}

  async create(text: string, channel_id: number, sender: User) {
    const chatLine: CreateChatLineDto = new CreateChatLineDto();

    chatLine.chatChannel = await this.chatChannelService.findOne(channel_id);
    chatLine.text = text;
    chatLine.sender = sender;
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
        'ChatLine => findOne()',
      );
    }

    return chatLine;
  }

  async getNextChatLines(chatChannelId: number, chatLineOffset: number) {
    const chatLine = await this.chatLineRepository
      .createQueryBuilder('chatLine')
      .where('chatLine.chatChannelId = :chatChannelId', {
        chatChannelId: chatChannelId,
      })
      .orderBy('chatLine.createdAt', 'DESC')
      .offset(chatLineOffset)
      .limit(20)
      .select(['chatLine', 'user.nickName', 'user.id'])
      .leftJoin('chatLine.sender', 'user')
      .getMany();

    if (chatLine === null) {
      throw new CustomException(
        `ChatChannel with id = [${chatChannelId}] doesn't have any messages`,
        HttpStatus.BAD_REQUEST,
        'ChatLine => getNextChatLines()',
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
