import * as React from "react";
import { Component } from "react";
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

export interface IDraggableProps {
  position: Point;
  rotation: number;
  center: Point;
  radius: number;
  onMove: (_: { position: Point; rotation: number }) => void;
}

export class Draggable extends Component<IDraggableProps> {
  private gRef?: SVGGElement;
  private dragging?: Point;

  public componentWillMount() {
    window.addEventListener("mousemove", this.onMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  public render() {
    const { position, rotation, children } = this.props;
    const [x, y] = position;

    return (
      <g
        ref={_ => (this.gRef = _ || undefined)}
        transform={`rotate(${rotation}) translate(${x} ${y})`}
        onMouseDown={this.onMouseDown}
      >
        {children}
      </g>
    );
  }

  private screenToLocal(point: Point): Point {
    const [x0, y0] = point;
    const { x, y } = new DOMPoint(x0, y0).matrixTransform(
      this.gRef!.getScreenCTM()!.inverse()
    );
    return [x, y];
  }

  private onMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    this.dragging = subtract(
      this.screenToLocal([clientX, clientY]),
      this.props.center
    );
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!event.buttons) {
      this.dragging = undefined;
    }

    if (this.dragging === undefined || !this.gRef) {
      return;
    }

    const { position, rotation, center, radius, onMove } = this.props;
    const { clientX, clientY, movementX, movementY } = event;

    const client: Point = [clientX, clientY];
    const movement: Point = [movementX, movementY];

    const x0 = this.screenToLocal(subtract(client, movement));
    const x = this.screenToLocal(client);
    const dr =
      toDegrees(
        dot(subtract(x, x0), perpendicular(this.dragging)) /
          radius /
          radius /
          radius
      ) * length(this.dragging);

    onMove({
      position: subtract(
        rotate(add(x, position), -dr),
        add(center, this.dragging)
      ),
      rotation: normalizeAngle(rotation + dr)
    });
  };
}
