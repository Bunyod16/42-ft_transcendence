import { ChatType } from '../entities/chat_line.entity';

export class CreateChatLineDto {
  text: string;
  chatType: ChatType;
  // directMessage: DirectMessage;
  // chatChannel: ChatChannel;
}
