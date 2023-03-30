import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}
