import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelType } from '../entities/chat_channel.entity';

export class CreateChatChannelDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  password: string;

  ownerId: number;

  createdAt: Date;

  @ApiProperty()
  channel_type: ChannelType;
}
