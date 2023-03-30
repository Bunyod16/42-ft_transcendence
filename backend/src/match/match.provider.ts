import { DataSource } from 'typeorm';
import { Match } from './entities/match.entity';

export const matchProviders = [
  {
    provide: 'MATCH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Match),
    inject: ['DATA_SOURCE'],
  },
];
