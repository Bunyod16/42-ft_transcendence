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

  @Column()
  password: string;

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
}
