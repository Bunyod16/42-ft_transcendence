export interface Player {
  id: number;
  nickName: string;
}

export interface GameInfo {
  playerOne: Player | undefined;
  playerTwo: Player | undefined;
  state: string | undefined;
  gameId: string | undefined;
}
