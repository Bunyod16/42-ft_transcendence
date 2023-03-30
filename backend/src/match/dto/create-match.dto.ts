import { User } from 'src/user/entities/user.entity';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  // @ApiProperty
  playerOne: User;

  playerTwo: User;

  playerOneScore: number;

  playerTwoScore: number;

  isPrivate: boolean;
}
