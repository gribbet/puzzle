import { Component } from "react";
import { Point } from "./model";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
export class Zoomable extends Component {
  @observable
  private position: Point = [0, 0];
  @observable
  private scale: number = 1;
  private gRef?: SVGGElement;

  public componentWillMount() {
    window.addEventListener("wheel", this.onWheel);
  }

  public componentWillUnmount() {
    window.removeEventListener("wheel", this.onWheel);
  }

  public render() {
    const { children } = this.props;
    const { position, scale } = this;

    return (
      <g
        ref={_ => (this.gRef = _ || undefined)}
        transform={this.transform(position, scale)}
        onWheel={this.onWheel}
      >
        {children}
      </g>
    );
  }

  private transform(position: Point, scale: number) {
    const [x, y] = position;
    return `scale(${scale}) translate(${x} ${y})`;
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.ctrlKey) {
      const ds = this.scale * event.deltaY * 0.01;

      const [ax, ay] = this.toLocal([event.clientX, event.clientY]);

      const [bx, by] = [
        (ax / this.scale) * (this.scale - ds),
        (ay / this.scale) * (this.scale - ds)
      ];

      const [x, y] = this.position;
      this.position = [x + bx - ax, y + by - ay];

      this.scale -= ds;
    } else {
      const [ax, ay] = this.toLocal([event.clientX, event.clientY]);
      const [bx, by] = this.toLocal([
        event.clientX + event.deltaX,
        event.clientY + event.deltaY
      ]);

      const [x, y] = this.position;
      this.position = [x + bx - ax, y + by - ay];
    }
  };

  private toLocal(point: Point): Point {
    const [x0, y0] = point;
    const { x, y } = new DOMPoint(x0, y0).matrixTransform(
      this.gRef!.getScreenCTM()!.inverse()
    );
    return [x, y];
  }
}
