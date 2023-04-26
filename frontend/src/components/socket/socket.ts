import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socket-types";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    withCredentials: true,
    // temporarily remove to avoid the socket error
    autoConnect: false,
  },
);
// export const gameSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
//   io(`${URL}/game`, {
//     autoConnect: false,
//   });
// Probably just use one socket

interface ChatClientToServerType {
  joinRoomDirectMessage: (data: { channelId: number }) => void;
}

interface ChatServerToClientType {
  joinRoomDirectMessage: string;
}

export const chatSocket: Socket<
ChatServerToClientType,
  ChatClientToServerType
> = io(`${URL}/chatSocket`, {
  withCredentials: true,
  // temporarily remove to avoid the socket error
  autoConnect: false,
});
