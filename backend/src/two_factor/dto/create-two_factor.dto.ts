import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString } from 'class-validator';

export class CreateTwoFactorDto {

  @Allow()
  user: User;

  @ApiProperty()
  @IsString()
  key: string;
}
