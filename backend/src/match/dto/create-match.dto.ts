import { Allow, IsBoolean, IsDate, IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {

  // @ApiProperty
  @Allow()
  playerOne: User;

  @Allow()
  playerTwo: User;

  @IsNumber()
  playerOneScore: number;

  @IsNumber()
  playerTwoScore: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsDate()
  endedAt: Date;
}
