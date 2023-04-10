import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socket-types";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    withCredentials: true,
    autoConnect: false,
  },
);
// export const gameSocket: Socket<ServerToClientEvents, ClientToServerEvents> =
//   io(`${URL}/game`, {
//     autoConnect: false,
//   });
// Probably just use one socket
