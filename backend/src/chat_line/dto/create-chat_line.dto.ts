import { User } from 'src/user/entities/user.entity';

export class CreateChatLineDto {
  text: string;
  sender: User;
  // chatChannel: ChatChannel;
}
