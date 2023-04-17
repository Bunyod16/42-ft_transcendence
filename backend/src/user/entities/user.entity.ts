import { FriendRequest } from 'src/friend_request/entities/friend_request.entity';
import { Match } from 'src/match/entities/match.entity';
import { UserAchievement } from 'src/user_achievement/entities/user_achievement.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ChatLine } from 'src/chat_line/entities/chat_line.entity';
import { ChatChannelMember } from 'src/chat_channel_member/entities/chat_channel_member.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickName: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @UpdateDateColumn({ name: 'updated_at' })
  'updated_at': Date;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: false })
  online: boolean;

  //Achievements
  @OneToMany(() => UserAchievement, (userAchivements) => userAchivements.user)
  achievements: UserAchievement[];

  //Matches Correlation
  @OneToMany(() => Match, (match) => match.playerOne)
  @JoinColumn({ name: 'playerOne' })
  matchesAsPlayerOne: Match[];

  @OneToMany(() => Match, (match) => match.playerTwo)
  @JoinColumn({ name: 'playerTwo' })
  matchesAsPlayerTwo: Match[];

  //FriendRequest
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  @JoinColumn({ name: 'requester' })
  requests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.responder)
  @JoinColumn({ name: 'responder' })
  responses: FriendRequest[];

  //hide this when querying
  @Column({ nullable: true, select: false })
  @Exclude()
  public currentHashedRefreshToken?: string;

  //chatLine Correlation
  @OneToMany(() => ChatLine, (chatLine) => chatLine.sender)
  @JoinColumn({ name: 'sender' })
  sentMessages: ChatLine[];

  //chatChannelMembers Correlation
  @OneToMany(
    () => ChatChannelMember,
    (chatChannelMember) => chatChannelMember.user,
  )
  @JoinColumn({ name: 'user' })
  chatChannelMembers: ChatChannelMember[];
}
