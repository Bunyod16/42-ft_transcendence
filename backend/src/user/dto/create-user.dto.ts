import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty()
    nickName: string;

    createdAt: Date;

    updatedAt: Date;

    @ApiProperty()
    password: string;

    // avatar:

    wins: number;

    losses: number;

    achievements: string;

    online: boolean;
}
