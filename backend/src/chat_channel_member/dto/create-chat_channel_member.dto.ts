import { Allow, IsBoolean, IsDate, IsNumber } from 'class-validator';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateChatChannelMemberDto {

  @IsNumber()
  id: number;

  @IsBoolean()
  isBlacklisted: boolean;

  @IsBoolean()
  isAdmin: boolean;

  @IsDate()
  mutedUntil: Date;

  @Allow()
  user: User;

  @Allow()
  chatChannel: ChatChannel;
}
