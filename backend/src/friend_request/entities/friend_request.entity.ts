import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

@Entity()
@Unique(['requester', 'responder'])
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  friendStatus: FriendStatus;

  @ManyToOne(() => User, (user) => user.requests, { nullable: false })
  requester: User;

  @ManyToOne(() => User, (user) => user.responses, { nullable: false })
  responder: User;
}
