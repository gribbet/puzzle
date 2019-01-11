import * as React from "react";
import { PureComponent } from "react";
import { style } from "typestyle";

import { Polygon } from "./Polygon";

export interface IPieceProps {
  index: number;
  shape: Polygon;
  imageUrl: string;
}

export class Piece extends PureComponent<IPieceProps> {
  public render() {
    const { index, shape, imageUrl } = this.props;

    return (
      <g>
        <clipPath id={`piece-${index}`}>
          <polygon points={shape.map(([x, y]) => `${x} ${y}`).join(", ")} />
        </clipPath>
        <image
          xlinkHref={imageUrl}
          x={0}
          y={0}
          width={1}
          height={1}
          className={style({
            cursor: "pointer",
            clipPath: `url(#piece-${index})`
          })}
        />
      </g>
    );
  }
}
