import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { CreateChatLineDto } from './dto/create-chat_line.dto';
import { UpdateChatLineDto } from './dto/update-chat_line.dto';
import { Logger } from '@nestjs/common';
import { ChatType } from './entities/chat_line.entity';

@Controller('chat-line')
export class ChatLineController {
  constructor(private readonly chatLineService: ChatLineService) {}

  @Post()
  async create(@Body() body: any) {
    let chat_type: string = body.chatLineType;
    const chat_id: number = parseInt(body.chatId);
    const text: string = body.text;

    if (typeof body.chatId !== 'number') {
      throw new HttpException(
        `Bad Request: ChatId is not a number`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //check if chat type is valid type
    chat_type = chat_type.toLowerCase();
    if (!Object.values(ChatType).includes(chat_type as string as ChatType)) {
      throw new HttpException(
        `Bad Request: Invalid Chat Type`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createChatLineDto: CreateChatLineDto = new CreateChatLineDto();

    createChatLineDto.chatType = chat_type as ChatType;
    createChatLineDto.text = text;

    try {
      const chat_line = await this.chatLineService.create(
        createChatLineDto,
        chat_id,
      );

      return chat_line;
    } catch (error) {
      Logger.error(error, `ChatLine => create()`);
      throw new HttpException(
        `Bad Request: ChatLine already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll() {
    return this.chatLineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chat_line = await this.chatLineService.findOne(id);

    Logger.log(
      `Trying to get chat_line with id = [${id}]`,
      'ChatLine => findOne()',
    );

    if (!chat_line) {
      Logger.log(
        `chat_line with id = [${id}] doeesn't exist`,
        'ChatLine => findOne()',
      );
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return chat_line;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatLineDto: UpdateChatLineDto,
  ) {
    return this.chatLineService.update(+id, updateChatLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatLineService.remove(+id);
  }
}
