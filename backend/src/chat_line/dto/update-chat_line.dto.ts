import { PartialType } from '@nestjs/swagger';
import { CreateChatLineDto } from './create-chat_line.dto';

export class UpdateChatLineDto extends PartialType(CreateChatLineDto) {}
