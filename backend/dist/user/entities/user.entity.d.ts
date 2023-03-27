export declare class User {
    id: number;
    nickName: string;
    'created_at': Date;
    'updated_at': Date;
    password: string;
    wins: number;
    losses: number;
    achievements: string;
    online: boolean;
}
export declare class CreateUserDto {
    nickName: string;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    wins: number;
    losses: number;
    achievements: string;
    online: boolean;
}
