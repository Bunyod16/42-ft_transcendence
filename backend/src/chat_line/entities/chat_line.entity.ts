import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';

export enum ChatLineType {
  MESSAGE = 'message',
  ACTIVEINVITE = 'activeinvite',
}

@Entity()
export class ChatLine {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  //For chat channel link
  @ManyToOne(() => ChatChannel, (chatChannel) => chatChannel.chatLines)
  chatChannel: ChatChannel;

  @Column({ type: 'enum', enum: ChatLineType, default: ChatLineType.MESSAGE })
  chatLineType: ChatLineType;
}
