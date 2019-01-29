import { Point } from "./model";

export function screenToLocal(g: SVGGElement, point: Point): Point {
  const [x0, y0] = point;
  const svgPoint = g.ownerSVGElement!.createSVGPoint();
  svgPoint.x = x0;
  svgPoint.y = y0;
  const { x, y } = svgPoint.matrixTransform(g.getScreenCTM()!.inverse());
  return [x, y];
}
