import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { CreateChatLineDto } from './dto/create-chat_line.dto';
import { UpdateChatLineDto } from './dto/update-chat_line.dto';
import { Logger } from '@nestjs/common';
import { CustomException } from 'src/utils/app.exception-filter';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('chat-line')
@UseGuards(UserAuthGuard)
export class ChatLineController {
  constructor(private readonly chatLineService: ChatLineService) {}

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const channel_id: number = parseInt(body.channelId);
    const text: string = body.text;
    const sender: User = req.user;

    if (typeof body.channelId !== 'number') {
      throw new CustomException(
        `Bad Request: ChannelId is not a number`,
        HttpStatus.BAD_REQUEST,
        `ChatLine => create()`,
      );
    }

    const createChatLineDto: CreateChatLineDto = new CreateChatLineDto();

    createChatLineDto.text = text;

    try {
      const chat_line = await this.chatLineService.create(
        text,
        channel_id,
        sender,
      );

      return chat_line;
    } catch (error) {
      Logger.error(error, `ChatLine => create()`);
      throw new CustomException(
        `Bad Request: ChatLine already exist`,
        HttpStatus.BAD_REQUEST,
        `ChatLine => create()`,
      );
    }
  }

  @Get()
  async findAll() {
    return await this.chatLineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chat_line = await this.chatLineService.findOne(id);

    Logger.log(
      `Trying to get chat_line with id = [${id}]`,
      'ChatLine => findOne()',
    );

    if (!chat_line) {
      throw new CustomException(
        `chat_line with id = [${id}] doeesn't exist`,
        HttpStatus.NOT_FOUND,
        `ChatLine => findOne()`,
      );
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatLineService.remove(id);
  }
}
