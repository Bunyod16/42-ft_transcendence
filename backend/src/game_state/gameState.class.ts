export class PlayerData {
    id: number;
    isConnected: boolean;
    x: number;
    y: number;
    constructor(id: number, x: number, y: number) {
        this.id = id;
        this.x = x;
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

export class GameState {
    id: number;
    playerOne: PlayerData;
    playerTwo: PlayerData;
    ballProperties: BallProperties;
    constructor(id: number, playerOneId: number, playerTwoId: number) {
        this.id = id;
        this.playerOne = new PlayerData(playerOneId, 0, 100);
        this.playerTwo = new PlayerData(playerTwoId, 0, -100);
        this.ballProperties = new BallProperties(0, 0);
    }
}