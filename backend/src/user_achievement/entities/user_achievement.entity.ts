import { Achievement } from 'src/achievement/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'achievement']) //to state that each userAchivement is unique in user
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.achievements, { nullable: false })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements)
  achievement: Achievement;
}
