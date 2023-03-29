import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTwoFactorDto {
  user: User;

  @ApiProperty()
  key: string;
}
