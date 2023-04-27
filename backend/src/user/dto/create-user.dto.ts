import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { Match } from 'src/match/entities/match.entity';
import { UserAchievement } from 'src/user_achievement/entities/user_achievement.entity';

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  intraName: string;

  @IsString()
  nickName: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  password: string;

  @IsNumber()
  wins: number;

  @IsString()
  avatar: string;

  @IsNumber()
  losses: number;

  @IsArray()
  achievements: UserAchievement[];

  @IsArray()
  matchesAsPlayerOne: Match[];

  @IsArray()
  matchesAsPlayerTwo: Match[];

  @IsBoolean()
  online: boolean;
}
