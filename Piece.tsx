import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { style } from "typestyle";

import { Draggable } from "./Draggable";
import { centroid, radius, add } from "./math";
import { IPiece } from "./model";

export interface IPieceProps {
  index: number;
  piece: IPiece;
  imageUrl: string;
}

@observer
export class Piece extends Component<IPieceProps> {
  public render() {
    const { index, piece, imageUrl } = this.props;
    const { position, rotation, shape } = piece;
    const [cx, cy] = centroid(shape);

    return (
      <g id={`piece-${index}`} transform={`translate(${cx} ${cy})`}>
        <Draggable
          position={position}
          rotation={rotation}
          radius={radius(shape)}
          onMove={_ => (piece.position = _)}
          onRotate={_ => (piece.rotation = _)}
        >
          <g transform={`translate(${-cx} ${-cy})`}>
            <polygon
              points={piece.shape.map(([x, y]) => `${x} ${y}`).join(", ")}
              fill="black"
            />

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
