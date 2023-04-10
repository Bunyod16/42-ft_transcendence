import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';

import { ValidateIf } from 'class-validator';
import { ChatLine } from 'src/chat_line/entities/chat_line.entity';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

@Entity()
export class ChatChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  ownerId: number;

  @Column({ default: 0 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @Column({ type: 'enum', enum: ChannelType, default: ChannelType.PUBLIC })
  channel_type: ChannelType;

  @ValidateIf((entity) => entity.channel_type === ChannelType.PROTECTED)
  @Column({ nullable: true })
  password: string;

  @OneToMany(() => ChatLine, (chatLine) => chatLine.chatChannel)
  chatLines: ChatLine[];
}
