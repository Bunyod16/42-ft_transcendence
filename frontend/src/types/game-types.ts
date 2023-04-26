export interface PlayerState {
  y: number;
  isConnected: boolean;
  score: number;
  skin: number;
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

export type GameStatus = "NoGame" | "Customize" | "InGame" | "Ended";

export interface Player {
  id: string;
  nickName: string;
  skin: number;
}

export interface MatchInfo {
  id: string;
  playerOne: Player;
  playerTwo: Player;
  playerOneScore?: number;
  playerTwoScore?: number;
  isWinner?: boolean;
  selectedSkin?: number;
}

export interface Textures {
  map: string;
  // displacementMap: string;
  normalMap: string;
  roughnessMap: string;
  aoMap: string;
}
