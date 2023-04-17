import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelType, ChatType } from '../entities/chat_channel.entity';

export class CreateChatChannelDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  password: string;

  ownerId: number;

  createdAt: Date;

  @ApiProperty()
  channel_type: ChannelType;

  @ApiProperty()
  chatType: ChatType;
}
