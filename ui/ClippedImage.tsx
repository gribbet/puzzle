import * as React from "react";
import { PureComponent } from "react";
import { Shape } from "../model";

export interface IClippedImageProps {
  imageUrl: string;
  shape: Shape;
}

let count = 0;

export class ClippedImage extends PureComponent<IClippedImageProps> {
  private index: number = count++;

  public render() {
    const { imageUrl, shape } = this.props;

    const path = shape
      .map(
        ([x, y], i) =>
          `${(i === 0 && "M") || (i % 3 == 1 && "C") || " "}${x.toFixed(
            4
          )} ${y.toFixed(4)}`
      )
      .reduce((a, b) => a + b);

    return (
      <g>
        <clipPath id={`clip-${this.index}`}>
          <path d={path} />
        </clipPath>
        <image
          xlinkHref={imageUrl}
          x={0}
          y={0}
          width={1}
          height={1}
          clipPath={`url(#clip-${this.index})`}
          cursor="pointer"
        />
        <path
          d={path}
          stroke="#00000040"
          strokeWidth="1px"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
  }
}
