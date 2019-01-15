export type Point = [number, number];

export type Shape = Point[];

export interface IPiece {
  offset: Point;
  rotation: number;
  shape: Shape;
}
