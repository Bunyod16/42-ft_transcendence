import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';
import { Allow, IsString } from 'class-validator';
import { ChatLineType } from '../entities/chat_line.entity';

export class CreateChatLineDto {

  @IsString()
  text: string;

  @Allow()
  sender: User;

  @Allow()
  chatChannel: ChatChannel;

  @Allow()
  chatLineType: ChatLineType;
}
