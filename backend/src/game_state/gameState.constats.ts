export const racketMoveDistance: number = 5;

export class Size {
  x: number;
  y: number;
}

export const planeSize = new Size();
planeSize.x = 600;
planeSize.y = 300;

export const racketSize = new Size();
racketSize.x = 20;
racketSize.y = planeSize.y / 5;