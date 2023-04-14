import { Injectable, Logger, UseGuards } from '@nestjs/common';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatLine } from 'src/chat_line/entities/chat_line.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    @InjectRepository(ChatLine)
    private chatLineRepository: Repository<ChatLine>,
  ) {}

  async findAll(userId: number, channelId: number) {
    const chatArray = await this.chatLineRepository.find({
      order: {
        createdAt: "DESC",
      },
      where: {
        sender: {
          id: userId
        },
        chatChannel: {
          id: channelId
        }
      },
      relations: ['sender', 'chatChannel']
    })
    return chatArray;
  }

  async findLastNum(userId: number, channelId: number, num: number, offset?: number) {
    const chatArray = await this.chatLineRepository.find({
      order: {
        createdAt: "DESC",
      },
      where: {
        sender: {
          id: userId
        },
        chatChannel: {
          id: channelId
        }
      },
      skip: offset == undefined ? 0 : offset,
      take: num,
      relations: ['sender', 'chatChannel']
    })
    return chatArray;
  }
}
