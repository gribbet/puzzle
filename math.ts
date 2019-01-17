import { Shape, Point } from "./model";

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

export function angle(
  [vx, vy]: Point,
  [ax, ay]: Point,
  [bx, by]: Point
): number {
  return (
    ((Math.atan2(by - vy, bx - vx) - Math.atan2(ay - vy, ax - vx)) / Math.PI) *
    180
  );
}

export function length([ax, ay]: Point, [bx, by]: Point): number {
  return Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
}

export function rotate([x, y]: Point, angle: number): Point {
  const c = Math.cos((angle / 180) * Math.PI);
  const s = Math.sin((angle / 180) * Math.PI);
  return [c * x - s * y, s * x + c * y];
}
