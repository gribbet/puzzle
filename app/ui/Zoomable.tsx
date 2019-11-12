import * as React from "react";
import { ReactNode, useRef, useState } from "react";
import { add, scale, subtract } from "../math";
import { Point } from "../model";
import { screenToLocal } from "../svg";
import { useWindowEvent } from "./useWindowEvent";

export function Zoomable(props: { children?: ReactNode }) {
  const [center, setCenter] = useState<Point>([0, 0]);
  const [zoom, setZoom] = useState(1);

  const element = useRef<SVGGElement>(null);

  useWindowEvent(
    "wheel",
    (event: WheelEvent) => {
      if (!element.current) {
        return;
      }

      event.stopPropagation();

      const { ctrlKey, clientX, clientY, deltaX, deltaY } = event;

      const client: Point = [clientX, clientY];
      const a = screenToLocal(element.current, client);

      if (ctrlKey) {
        const dz = zoom * deltaY * 0.01;

        setCenter(add(scale(subtract(center, a), (zoom + dz) / zoom), a));
        setZoom(zoom - dz);
      } else {
        const b = screenToLocal(element.current, [
          clientX + deltaX,
          clientY + deltaY
        ]);

        setCenter(add(center, subtract(b, a)));
      }
    },
    [center, scale]
  );

  const { children } = props;
  const [x, y] = center;

  return (
    <g ref={element} transform={`scale(${zoom}) translate(${-x} ${-y})`}>
      {children}
    </g>
  );
}
