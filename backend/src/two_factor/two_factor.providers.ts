import { DataSource } from 'typeorm';
import { TwoFactor } from './entities/two_factor.entity';

export const twoFactorProviders = [
  {
    provide: 'TWOFACTOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TwoFactor),
    inject: ['DATA_SOURCE'],
  },
];
