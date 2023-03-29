import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class TwoFactor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  key: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;
}
