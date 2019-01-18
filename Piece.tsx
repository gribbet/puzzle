import * as React from "react";
import { PureComponent, Component } from "react";
import { style } from "typestyle";

import { observable } from "mobx";
import { observer } from "mobx-react";
import { Shape, Point, IPiece } from "./model";
import {
  centroid,
  rotate,
  subtract,
  angle,
  dot,
  perpendicular,
  normalize,
  length,
  radius,
  toDegrees,
  add,
  scale
} from "./math";
import { CaughtException } from "mobx/lib/internal";

export interface IPieceProps {
  index: number;
  piece: IPiece;
  imageUrl: string;
}

@observer
export class Piece extends Component<IPieceProps> {
  private gRef?: SVGGElement;
  private dragging?: Point;

  public componentWillMount() {
    window.addEventListener("mousemove", this.onMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  public render() {
    const { index, piece, imageUrl } = this.props;
    const { offset, rotation, shape } = piece;
    const [x, y] = offset;
    const [cx, cy] = centroid(shape);

    return (
      <g
        onMouseDown={this.onMouseDown}
        id={`piece-${index}`}
        transform={`translate(${cx} ${cy})`}
      >
        <g
          ref={_ => (this.gRef = _ || undefined)}
          transform={`rotate(${rotation}) translate(${x} ${y})`}
        >
          <g transform={`translate(${-cx} ${-cy})`}>
            <clipPath id={`piece-clip-${index}`}>
              <polygon
                points={piece.shape.map(([x, y]) => `${x} ${y}`).join(", ")}
              />
            </clipPath>

            <polygon
              points={shape.map(([x, y]) => `${x} ${y}`).join(", ")}
              fill="black"
            />

            <image
              xlinkHref={imageUrl}
              x={0}
              y={0}
              width={1}
              height={1}
              className={style({
                cursor: "pointer",
                clipPath: `url(#piece-clip-${index})`
              })}
            />

            <polygon
              points={shape.map(([x, y]) => `${x} ${y}`).join(", ")}
              stroke="#ffffff40"
              strokeWidth="0.5px"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      </g>
    );
  }

  private toLocal(point: Point): Point {
    return this.transform(point, this.gRef!.getScreenCTM()!.inverse());
  }

  private toScreen(point: Point): Point {
    return this.transform(point, this.gRef!.getScreenCTM()!);
  }

  private transform(point: Point, matrix?: DOMMatrix): Point {
    const [x0, y0] = point;
    const { x, y } = new DOMPoint(x0, y0).matrixTransform(matrix);
    return [x, y];
  }

  private onMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    this.dragging = this.toLocal([clientX, clientY]);
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!event.buttons) {
      this.dragging = undefined;
    }

    if (this.dragging === undefined) {
      return;
    }

    const { piece } = this.props;
    const { shape, offset } = piece;

    const { clientX, clientY, movementX, movementY } = event;

    const a = this.toLocal([clientX - movementX, clientY - movementY]);
    const b = this.toLocal([clientX, clientY]);

    const dr = toDegrees(
      dot(
        subtract(b, a),
        scale(perpendicular(this.dragging), 1 / radius(shape))
      ) / radius(shape)
    );

    piece.rotation += dr;

    const matrix = new DOMMatrix().multiply(
      this.gRef!.getScreenCTM()!.rotate(0, 0, dr)
    );
    const c = this.transform([clientX, clientY], matrix.inverse());
    piece.offset = add(offset, subtract(c, this.dragging));
  };
}
