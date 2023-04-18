import { GameState } from "@/types/game-types";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  matchFound: (data: unknown) => void;
  queueEnterSuccess: () => void;
  updateGame: (data: GameState) => void;
  fuck: () => void;
  gameEnded: (data: GameState) => void;
}

export interface ClientToServerEvents {
  authenticateUser: () => void;
  queueEnter: () => void;
  queueLeave: () => void;
  userConnected: () => void;
  userDisconnected: () => void;
  playerUp: (data: { gameId: string }) => void;
  playerDown: (data: { gameId: string }) => void;
  leaveGame: () => void;
}

// export interface MatchFoundData {

// }
