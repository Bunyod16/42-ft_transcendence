import { PartialType } from '@nestjs/swagger';
import { CreateChatChannelDto } from './create-chat_channel.dto';

export class UpdateChatChannelDto extends PartialType(CreateChatChannelDto) {}
