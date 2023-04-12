import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateChatChannelMemberDto {
  id: number;

  isBlacklisted: boolean;

  isAdmin: boolean;

  mutedUntil: Date;

  user: User;

  chatChannel: ChatChannel;
}
