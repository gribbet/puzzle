import * as React from "react";
import { PureComponent, MouseEvent, Component } from "react";
import { style } from "typestyle";

import { observable } from "mobx";
import { observer } from "mobx-react";
import { Shape, Point, IPiece } from "./model";
import { centroid } from "./math";

export interface IPieceProps {
  index: number;
  piece: IPiece;
  imageUrl: string;
  onDragStart: () => void;
}

@observer
export class Piece extends Component<IPieceProps> {
  public render() {
    const { index, piece, imageUrl } = this.props;
    const { offset, rotation, shape } = piece;
    const [x, y] = offset;
    const [cx, cy] = centroid(shape);

    return (
      <g
        transform={`rotate(${rotation} ${cx} ${cy}) translate(${x} ${y})`}
        onMouseDown={this.onMouseDown}
        id={`piece-${index}`}
      >
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
    );
  }

  private onMouseDown = () => this.props.onDragStart();
}
