import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { add, subtract, scale } from "../math";
import { Point } from "../model";
import { screenToLocal } from "../svg";

@observer
export class Zoomable extends Component {
  @observable
  private center: Point = [0, 0];
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
    const { center, scale } = this;

    const [x, y] = center;

    return (
      <g
        ref={_ => (this.gRef = _ || undefined)}
        transform={`scale(${scale}) translate(${-x} ${-y})`}
      >
        {children}
      </g>
    );
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.ctrlKey) {
      const ds = this.scale * event.deltaY * 0.01;
      const a = screenToLocal(this.gRef!, [event.clientX, event.clientY]);

      this.center = add(scale(subtract(this.center, a), (this.scale + ds)/this.scale), a);
      this.scale -= ds;
    } else {
      const a = screenToLocal(this.gRef!, [event.clientX, event.clientY]);
      const b = screenToLocal(this.gRef!, [
        event.clientX + event.deltaX,
        event.clientY + event.deltaY
      ]);

      this.center = add(this.center, subtract(b, a));
    }
  };
}
