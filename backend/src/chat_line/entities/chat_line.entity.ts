import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ChatType {
  DIRECT_MESSAGE = 'direct_message',
  CHAT_CHANNEL = 'chat_channel',
}

@Entity()
export class ChatLine {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  text: string;

  @Column()
  chatType: ChatType;

  // @ManyToOne(() => DirectMessage, (directMessage) => directMessage.chatLines)
  // directMessage: DirectMessage;

  // @ManyToOne(() => ChatChannel, (chatChannel) => chatChannel.chatLines)
  // chatChannel: ChatChannel;
}
