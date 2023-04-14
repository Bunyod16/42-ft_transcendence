export class PlayerData {
  id: number;
  isConnected: boolean;
  x: number;
  y: number;
  constructor(id: number, y: number) {
    this.id = id;
    this.y = y;
    this.isConnected = false;
  }
}

export class BallProperties {
  dy: number;
  dx: number;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.dy = 0;
    this.dx = 0;
    this.x = x;
    this.y = y;
  }
}

export class GamePlane {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
  }


export class GameState {
  id: number;
  playerOne: PlayerData;
  playerTwo: PlayerData;
  ballProperties: BallProperties;
  gamePlane: GamePlane;
  constructor(id: number, playerOneId: number, playerTwoId: number) {
    this.id = id;
    this.playerOne = new PlayerData(playerOneId, 0);
    this.playerTwo = new PlayerData(playerTwoId, 0);
    this.ballProperties = new BallProperties(0, 0);
    this.gamePlane = new GamePlane(600, 300);
  }
}
