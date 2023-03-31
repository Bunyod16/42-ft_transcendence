import { DataSource } from 'typeorm';
import { UserAchievement } from './entities/user_achievement.entity';

export const userAchievementProviders = [
  {
    provide: 'USER_ACHIEVEMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserAchievement),
    inject: ['DATA_SOURCE'],
  },
];
