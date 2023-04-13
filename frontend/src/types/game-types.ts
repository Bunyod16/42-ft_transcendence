export interface Player {
  id: number;
  nickName: string;
}

export interface PlayerState {
  y: number;
  isConnected: boolean;
}

export interface GameState {
  playerOneState: PlayerState;
  playerTwoState: PlayerState;
  ballProperties: {
    dy: number;
    dx: number;
    x: number;
    y: number;
  };
  gameId: string;
}

export interface MatchInfo {
  playerOne: Player | undefined;
  playerTwo: Player | undefined;
}
