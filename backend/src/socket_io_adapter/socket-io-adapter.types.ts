import { Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';

export type SocketWithAuthData = Socket & { user: User };
