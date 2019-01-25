import * as React from "react";
import { PureComponent } from "react";
import { centroid, radius } from "../math";
import { IPiece, Point } from "../model";
import { Draggable } from "./Draggable";

export interface IPieceProps {
  piece: IPiece;
  imageUrl: string;
  onMove: (_: { number: number; position: Point; rotation: number }) => void;
}

export class Piece extends PureComponent<IPieceProps> {
  public render() {
    const { piece, imageUrl } = this.props;
    const { number, position, rotation, shape } = piece;

    const path = shape
      .map(
        ([x, y], i) =>
          `${(i === 0 && "M") || (i % 3 == 1 && "C") || " "}${x.toFixed(
            3
          )} ${y.toFixed(3)}`
      )
      .reduce((a, b) => a + b);

    return (
      <Draggable
        position={position}
        rotation={rotation}
        center={centroid(shape)}
        radius={radius(shape)}
        onMove={this.onMove}
      >
        <clipPath id={`clip-${number}`}>
          <path d={path} />
        </clipPath>
        <image
          xlinkHref={imageUrl}
          x={0}
          y={0}
          width={1}
          height={1}
          clipPath={`url(#clip-${number})`}
          cursor="pointer"
        />
        <path
          d={path}
          stroke="#00000040"
          strokeWidth="1px"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </Draggable>
    );
  }

  private onMove = ({
    position,
    rotation
  }: {
    position: Point;
    rotation: number;
  }) => {
    const { piece, onMove } = this.props;
    const { number } = piece;
    onMove({ number, position, rotation });
  };
}
