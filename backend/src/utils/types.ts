import { Socket } from 'socket.io';

export type SocketWithAuthData = Socket & { userId: number };
