import { Point, Shape } from "./model";

export function area(shape: Shape): number {
  return (
    0.5 *
    shape
      .map((v1, i) => {
        const [x1, y1] = v1;
        const [x2, y2] = shape[(i + 1) % shape.length];
        return x1 * y2 - x2 * y1;
      })
      .reduce((a, b) => a + b)
  );
}

export function centroid(shape: Shape): Point {
  const a = area(shape);
  return shape
    .map<Point>(([x1, y1], i) => {
      const [x2, y2] = shape[(i + 1) % shape.length];
      const q = (x1 * y2 - x2 * y1) / 6 / a;
      return [(x1 + x2) * q, (y1 + y2) * q];
    })
    .reduce(([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]);
}

export function radius(shape: Shape): number {
  const c = centroid(shape);
  return Math.sqrt(
    shape
      .map(x => subtract(x, c))
      .map(([x, y]) => x * x + y * y)
      .reduce((a, b) => a + b) / shape.length
  );
}

export function boundingRadius(shape: Shape): number {
  const c = centroid(shape);
  return Math.sqrt(
    shape
      .map(x => subtract(x, c))
      .map(([x, y]) => x * x + y * y)
      .reduce((a, b) => Math.max(a, b))
  );
}

export function angle(
  [vx, vy]: Point,
  [ax, ay]: Point,
  [bx, by]: Point
): number {
  return toDegrees(Math.atan2(by - vy, bx - vx) - Math.atan2(ay - vy, ax - vx));
}

export function distance(a: Point, b: Point): number {
  return length(subtract(b, a));
}

export function rotate([x, y]: Point, angle: number): Point {
  const c = Math.cos(toRadians(angle));
  const s = Math.sin(toRadians(angle));
  return [c * x - s * y, s * x + c * y];
}

export function perpendicular([x, y]: Point): Point {
  return [-y, x];
}

export function dot([x1, y1]: Point, [x2, y2]: Point): number {
  return x1 * x2 + y1 * y2;
}

export function add([x1, y1]: Point, [x2, y2]: Point): Point {
  return [x1 + x2, y1 + y2];
}

export function subtract([x1, y1]: Point, [x2, y2]: Point): Point {
  return [x1 - x2, y1 - y2];
}

export function normalize(x: Point): Point {
  return scale(x, 1 / length(x));
}

export function length([x, y]: Point): number {
  return Math.sqrt(x * x + y * y);
}

export function scale([x, y]: Point, a: number): Point {
  return [a * x, a * y];
}

export function toDegrees(x: number): number {
  return (x / Math.PI) * 180;
}

export function toRadians(x: number): number {
  return (x * Math.PI) / 180;
}

export function normalizeAngle(x: number): number {
  return ((x % 360) + 360) % 360;
}
