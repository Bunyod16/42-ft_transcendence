import { PartialType } from '@nestjs/swagger';
import { CreateChatChannelMemberDto } from './create-chat_channel_member.dto';

export class UpdateChatChannelMemberDto extends PartialType(CreateChatChannelMemberDto) {}
