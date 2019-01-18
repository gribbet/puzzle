export type Point = [number, number];

export type Shape = Point[];

export interface IPiece {
  number: number;
  position: Point;
  rotation: number;
  shape: Shape;
}

export interface IPuzzle {
  url: string;
  pieces: IPiece[];
}
