import { DataSource } from 'typeorm';
import { TwoFactor } from './entities/two_factor.entity';
export declare const twoFactorProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<TwoFactor>;
    inject: string[];
}[];
