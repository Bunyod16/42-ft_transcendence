import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelType, ChatType } from '../entities/chat_channel.entity';
import { Allow, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateChatChannelDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  password: string;

  @IsNumber()
  ownerId: number;

  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Allow()
  channel_type: ChannelType;

  @ApiProperty()
  @Allow()
  chatType: ChatType;
}
