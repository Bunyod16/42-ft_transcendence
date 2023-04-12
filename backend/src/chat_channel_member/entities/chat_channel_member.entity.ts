import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  Unique,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChatChannel } from 'src/chat_channels/entities/chat_channel.entity';

@Entity()
@Unique(['user', 'chatChannel'])
export class ChatChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @Column({ nullable: false, default: false })
  isBlacklisted: boolean;

  @Column({ nullable: true })
  mutedUntil: Date;

  @ManyToOne(() => User, (user) => user.chatChannelMembers)
  user: User;

  @ManyToOne(() => ChatChannel, (chatChannel) => chatChannel.chatChannelMembers)
  chatChannel: ChatChannel;
}
