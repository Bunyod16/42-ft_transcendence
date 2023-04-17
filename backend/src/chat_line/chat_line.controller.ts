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
  Query,
} from '@nestjs/common';
import { ChatLineService } from './chat_line.service';
import { UpdateChatLineDto } from './dto/update-chat_line.dto';
import { Logger } from '@nestjs/common';
import { CustomException } from 'src/utils/app.exception-filter';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';

@Controller('chat-line')
export class ChatLineController {
  constructor(private readonly chatLineService: ChatLineService) {}

  private readonly logger = new Logger(ChatLineController.name);

  @Post()
  @UseGuards(UserAuthGuard)
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

  @Get('/getNextChatLines/:chatChannelId')
  @UseGuards(UserAuthGuard)
  async getNextChatLines(
    @Param('chatChannelId', ParseIntPipe) chatChannelId: number,
    @Query('chatLineOffset', ParseIntPipe) chatLineOffset: number,
  ) {
    // this.logger.debug(
    //   `Trying to get next ${chatLineOffset} amount of chat_line with chat ChatChannelId = [${chatChannelId}]`,
    // );

    Logger.log(
      `Trying to get next ${chatLineOffset} amount of chat_line with chat ChatChannelId = [${chatChannelId}]`,
      'ChatLine => getNextChatLines()',
    );

    return await this.chatLineService.getNextChatLines(
      chatChannelId,
      chatLineOffset,
    );
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async findAll() {
    return await this.chatLineService.findAll();
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const chat_line = await this.chatLineService.findOne(id);

    Logger.log(
      `Trying to get chat_line with id = [${id}]`,
      'ChatLine => findOne()',
    );

    return chat_line;
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateChatLineDto: UpdateChatLineDto,
  ) {
    return this.chatLineService.update(+id, updateChatLineDto);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatLineService.remove(id);
  }
}
