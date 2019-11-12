import * as React from "react";
import { ReactNode, useCallback, useRef, useState } from "react";
import {
  add,
  dot,
  length,
  normalizeAngle,
  perpendicular,
  rotate,
  subtract,
  toDegrees
} from "../math";
import { Point } from "../model";
import { screenToLocal } from "../svg";
import { format } from "../util";
import { useWindowEvent } from "./useWindowEvent";

export interface IDraggableProps {
  position: Point;
  rotation: number;
  center: Point;
  radius: number;
  onMove: (_: { position: Point; rotation: number }) => void;
  onMoveEnd: () => void;
  children?: ReactNode;
}

export function Draggable(props: IDraggableProps) {
  const element = useRef<SVGGElement>(null);
  const [dragging, setDragging] = useState<Point | undefined>();

  const {
    position,
    rotation,
    center,
    radius,
    onMove,
    onMoveEnd,
    children
  } = props;

  useWindowEvent(
    "mousemove",
    (event: MouseEvent) => {
      if (!dragging || !element.current) {
        return;
      }

      const { clientX, clientY, movementX, movementY, buttons } = event;

      if (!buttons) {
        setDragging(undefined);
        onMoveEnd();
        return;
      }

      if (!movementX && !movementY) {
        return;
      }

      const client: Point = [clientX, clientY];
      const movement: Point = [movementX, movementY];
      const offset = subtract(dragging, center);

      const x0 = screenToLocal(element.current, subtract(client, movement));
      const x = screenToLocal(element.current, client);
      const dr =
        toDegrees(
          dot(subtract(x, x0), perpendicular(offset)) / radius / radius / radius
        ) * length(offset);

      onMove({
        position: subtract(rotate(add(x, position), -dr), add(center, offset)),
        rotation: normalizeAngle(rotation + dr)
      });
    },
    [position, rotation, center, radius, onMove, onMoveEnd]
  );

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    if (!element.current) {
      return;
    }
    event.preventDefault();
    const { clientX, clientY } = event;
    const client: Point = [clientX, clientY];
    setDragging(screenToLocal(element.current, client));
  }, []);

  const [x, y] = position;

  return (
    <g
      ref={element}
      transform={`rotate(${format(rotation)}) translate(${format(x)} ${format(
        y
      )})`}
      onMouseDown={onMouseDown}
    >
      {children}
    </g>
  );
}
