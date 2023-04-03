import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}

@Entity()
export class ChatChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  ownerId: string;

  @Column({ default: 0 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @Column({ type: 'enum', enum: ChannelType, default: ChannelType.PUBLIC })
  channel_type: ChannelType;

  @Column({ nullable: true })
  password: string;
}
