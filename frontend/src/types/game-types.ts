export interface Player {
  id: number;
  nickName: string;
}

export interface PlayerState {
  y: number;
  isConnected: boolean;
  score: number;
}

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  ballProperties: {
    dy: number;
    dx: number;
    x: number;
    y: number;
  };
}

export type GameStatus = "InGame" | "Ended" | "NoGame";

export interface MatchInfo {
  id: string;
  playerOne: Player | undefined;
  playerTwo: Player | undefined;
  playerOneScore?: number;
  playerTwoScore?: number;
  gameStatus?: GameStatus;
  isWinner?: boolean;
}
