import { Component } from "react";
import * as React from "react";

import { dot, perpendicular, subtract, toDegrees, add } from "./math";
import { Point } from "./model";

export interface IDraggableProps {
  position: Point;
  rotation: number;
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

  private toLocal(point: Point): Point {
    return this.transform(point, this.gRef!.getScreenCTM()!.inverse());
  }

  private transform(point: Point, matrix?: DOMMatrix): Point {
    const [x0, y0] = point;
    const { x, y } = new DOMPoint(x0, y0).matrixTransform(matrix);
    return [x, y];
  }

  private onMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    this.dragging = this.toLocal([clientX, clientY]);
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!event.buttons) {
      this.dragging = undefined;
    }

    if (this.dragging === undefined) {
      return;
    }

    const { position, rotation, radius, onMove } = this.props;
    const { clientX, clientY, movementX, movementY } = event;

    const client: Point = [clientX, clientY];
    const movement: Point = [movementX, movementY];

    const x0 = this.toLocal(subtract(client, movement));
    const x = this.toLocal(client);

    const dr = toDegrees(
      dot(subtract(x, x0), perpendicular(this.dragging)) / radius / radius
    );

    onMove({
      position: add(position, subtract(this.toLocal(client), this.dragging)),
      rotation: rotation + dr
    });
  };
}
