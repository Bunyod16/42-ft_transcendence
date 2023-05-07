import { Socket, io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socket-types";
import { FriendType } from "@/types/social-type";
import { UserProfile } from "@/types/user-profile-type";
// "undefined" means the URL will be computed from the `window.location` object
const hostUrl = process.env.HOST_URL || "localhost";
const URL = process.env.NEXT_PUBLIC_API_URL || "";

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
  joinRoomDirectMessage: (data: { chatChannelId: number }) => void;
  joinRoom: (data: { chatChannelId: number }) => void;
  sendMessage: (data: { message: string; chatChannelId: number }) => void;
}

interface ChatServerToClientType {
  chatMessage: (data: {
    text: string;
    sender: { id: number; nickName: string };
  }) => void;
  friendOnline: (data: FriendType) => void;
  friendOffline: (data: FriendType) => void;
}

export const chatSocket: Socket<
  ChatServerToClientType,
  ChatClientToServerType
> = io(`${URL}/chatSockets`, {
  withCredentials: true,
  // temporarily remove to avoid the socket error
  autoConnect: false,
});
