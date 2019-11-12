import * as React from "react";
import { useMemo } from "react";
import { Shape } from "../model";
import { format } from "../util";

export interface IClippedImageProps {
  imageUrl: string;
  shape: Shape;
}

let count = 0;

export function ClippedImage(props: IClippedImageProps) {
  const index: number = count++;

  const { imageUrl, shape } = props;

  const path = useMemo(
    () =>
      shape
        .map(
          ([x, y], i) =>
            `${(i === 0 && "M") || (i % 3 == 1 && "C") || " "}${format(
              x
            )} ${format(y)}`
        )
        .reduce((a, b) => a + b) + "Z",
    [shape]
  );

  return (
    <g>
      <clipPath id={`clip-${index}`}>
        <path d={path} />
      </clipPath>
      <image
        xlinkHref={imageUrl}
        x={0}
        y={0}
        width={1}
        height={1}
        clipPath={`url(#clip-${index})`}
        cursor="pointer"
      />
    </g>
  );
}
