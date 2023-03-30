import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/match/entities/match.entity';
import { UserAchievement } from 'src/user_achievement/entities/user_achievement.entity';

export class CreateUserDto {
  @ApiProperty()
  nickName: string;

  createdAt: Date;

  updatedAt: Date;

  @ApiProperty()
  password: string;

  // avatar:

  wins: number;

  losses: number;

  achievements: UserAchievement[];

  matchesAsPlayerOne: Match[];

  matchesAsPlayerTwo: Match[];

  online: boolean;
}
