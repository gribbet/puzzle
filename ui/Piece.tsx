import * as React from "react";
import { Component } from "react";
import { centroid, radius } from "../math";
import { IPiece, Point } from "../model";
import { Draggable } from "./Draggable";

export interface IPieceProps {
  piece: IPiece;
  imageUrl: string;
  onMove: (_: { position: Point; rotation: number }) => void;
}

export class Piece extends Component<IPieceProps> {
  public render() {
    const { piece, imageUrl, onMove } = this.props;
    const { position, rotation, shape } = piece;
    const [cx, cy] = centroid(shape);

    return (
      <g transform={`translate(${cx} ${cy})`}>
        <Draggable
          position={position}
          rotation={rotation}
          radius={radius(shape)}
          onMove={onMove}
        >
          <g transform={`translate(${-cx} ${-cy})`}>
            <image
              xlinkHref={imageUrl}
              x={0}
              y={0}
              width={1}
              height={1}
              clipPath={`polygon(${shape
                .map(([x, y]) => `${x} ${y}`)
                .join(", ")})`}
              cursor="pointer"
            />
            <polygon
              points={shape.map(([x, y]) => `${x} ${y}`).join(", ")}
              stroke="#ffffff40"
              strokeWidth="0.5px"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </Draggable>
      </g>
    );
  }
}
