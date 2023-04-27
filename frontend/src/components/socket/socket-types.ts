import { GameState, MatchInfo } from "@/types/game-type";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  matchFound: (data: MatchInfo) => void;
  queueEnterSuccess: () => void;
  updateGame: (data: GameState) => void;
  fuck: () => void;
  gameEnded: (data: GameState) => void;
  matchBegin: (data: GameState) => void;
}

export interface ClientToServerEvents {
  authenticateUser: () => void;
  queueEnter: () => void;
  queueLeave: () => void;
  cancelPlayWithFriend: () => void;
  inviteFriend: (data: { friendId: string }) => void;
  userConnected: () => void;
  userDisconnected: () => void;
  playerUp: (data: { gameId: string }) => void;
  playerDown: (data: { gameId: string }) => void;
  leaveGame: () => void;
}

// export interface MatchFoundData {

// }
