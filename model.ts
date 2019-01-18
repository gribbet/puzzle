export type Point = [number, number];

export type Shape = Point[];

export interface IPiece {
  position: Point;
  rotation: number;
  shape: Shape;
}
