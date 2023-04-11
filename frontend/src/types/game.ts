export interface Player {
  id: number;
  nickName: string;
}

export interface GameState {
  playerOne: Player | undefined;
  playerTwo: Player | undefined;
  state: string | undefined;
}
