import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { IsString, ValidateIf } from 'class-validator';
import { ChatLine } from 'src/chat_line/entities/chat_line.entity';
import { ChatChannelMember } from 'src/chat_channel_member/entities/chat_channel_member.entity';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private', //invite only
  PROTECTED = 'protected', //password protected
}

export enum ChatType {
  DIRECT_MESSAGE = 'direct_message',
  GROUP_MESSAGE = 'group_message',
}

@Entity()
export class ChatChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  ownerId: number;

  @Column({ default: null })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @Column({ type: 'enum', enum: ChannelType, default: ChannelType.PUBLIC })
  channel_type: ChannelType;

  @Column({ type: 'enum', enum: ChatType, nullable: false })
  chatType: ChatType;

  @ValidateIf((entity) => entity.channel_type === ChannelType.PROTECTED)
  @IsString()
  @Column({ nullable: true, select: false })
  password: string;

  @OneToMany(() => ChatLine, (chatLine) => chatLine.chatChannel)
  chatLines: ChatLine[];

  @OneToMany(
    () => ChatChannelMember,
    (chatChannelMembers) => chatChannelMembers.chatChannel,
  )
  chatChannelMembers: ChatChannelMember[];
}
