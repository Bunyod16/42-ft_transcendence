export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  matchFound: (data: unknown) => void;
  queueEnterSuccess: () => void;
  updateGame: (data: unknown) => void;
  fuck: () => void;
}

export interface ClientToServerEvents {
  queueEnter: () => void;
  queueLeave: () => void;
  playerUp: (data: { gameId: string }) => void;
  playerDown: (data: { gameId: string }) => void;
  leaveGame: () => void;
}
