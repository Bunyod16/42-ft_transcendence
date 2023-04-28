import { Allow, IsString } from 'class-validator';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateUserAchievementDto {

  @IsString()
  id: number;

  @Allow()
  user: User;

  @Allow()
  achievement: Achievement;
}
