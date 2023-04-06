import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';

export class CreateChatLineDto {
  text: string;
  sender: User;
  chatChannel: ChatChannel;
}
