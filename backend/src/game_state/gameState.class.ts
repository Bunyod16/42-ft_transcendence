export class Coords {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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
    playerOneCoords: Coords;
    playerTwoCoords: Coords;
    ballProperties: BallProperties;
    constructor(id: number) {
        this.id = id;
        this.playerOneCoords = new Coords(0, 100);
        this.playerTwoCoords = new Coords(0, -100);
        this.ballProperties = new BallProperties(0, 0);
    }
}