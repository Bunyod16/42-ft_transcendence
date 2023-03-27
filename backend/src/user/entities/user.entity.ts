import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({default: 0})
  wins: number

  @Column({default: 0})
  losses: number

  @Column({default: ''})
  achievements: string

  @Column({default: false})
  online: boolean
}

export class CreateUserDto {
    nickName: string;

    createdAt: Date;

    updatedAt: Date;

    password: string;

    // avatar:

    wins: number;

    losses: number;

    achievements: string;

    online: boolean;
}
