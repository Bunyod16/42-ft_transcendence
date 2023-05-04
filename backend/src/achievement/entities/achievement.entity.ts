import { UserAchievement } from 'src/user_achievement/entities/user_achievement.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  description: string;

  @Column({})
  url: string;

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
  )
  userAchievements: UserAchievement[];
}
