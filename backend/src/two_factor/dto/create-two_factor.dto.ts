import { User } from 'src/user/entities/user.entity';

export class CreateTwoFactorDto {
  user: User;
  key: string;
}
