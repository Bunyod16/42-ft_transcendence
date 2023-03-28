import { User } from 'src/user/entities/user.entity';
export declare class TwoFactor {
    id: number;
    user: User;
    key: string;
    'created_at': Date;
}
