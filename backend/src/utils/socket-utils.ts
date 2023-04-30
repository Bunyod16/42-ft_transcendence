import { SocketWithAuthData } from 'src/socket_io_adapter/socket-io-adapter.types';
import { User } from 'src/user/entities/user.entity';
import { Server, Namespace } from 'socket.io';

export function findUserSocket(user: User, server: Server): SocketWithAuthData {
  var userSocket: SocketWithAuthData;
  server.sockets.sockets.forEach(
    (sock: SocketWithAuthData, socket_id): SocketWithAuthData => {
      if (user.id === sock.user.id) {
        userSocket = sock as SocketWithAuthData;
        return;
      }
    },
  );
  return userSocket;
}

export function findUserSocketWithNamespace(
  user: User,
  server: Namespace,
): SocketWithAuthData {
  var userSocket: SocketWithAuthData;
  server.sockets.forEach(
    (sock: SocketWithAuthData, socket_id): SocketWithAuthData => {
      if (user.id === sock.user.id) {
        userSocket = sock as SocketWithAuthData;
        return;
      }
    },
  );
  return userSocket;
}
