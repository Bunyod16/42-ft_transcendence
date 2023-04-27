import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';
import { Allow, IsString } from 'class-validator';

export class CreateChatLineDto {

  @IsString()
  text: string;

  @Allow()
  sender: User;

  @Allow()
  chatChannel: ChatChannel;
}
