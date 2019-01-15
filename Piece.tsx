import * as React from "react";
import { PureComponent, MouseEvent, Component } from "react";
import { style } from "typestyle";

import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { observable } from "mobx";
import { observer } from "mobx-react";

export interface IPieceProps {
  index: number;
  shape: Polygon;
  imageUrl: string;
}

@observer
export class Piece extends Component<IPieceProps> {
  private dragging: boolean = false;
  private gRef?: SVGGElement;
  @observable
  private position: Vertex = [Math.random() - 0.5, Math.random() - 0.5];
  @observable
  private rotation: number = Math.random() * 360;

  public render() {
    const { index, shape, imageUrl } = this.props;
    const [x, y] = this.position;

    return (
      <g
        ref={_ => (this.gRef = _ || undefined)}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        transform={`rotate(${this.rotation}) translate(${x - 0.5} ${y - 0.5})`}
      >
        <clipPath id={`piece-${index}`}>
          <polygon points={shape.map(([x, y]) => `${x} ${y}`).join(", ")} />
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
            clipPath: `url(#piece-${index})`
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

  private onMouseDown = () => (this.dragging = true);

  private onMouseMove = (event: MouseEvent) => {
    if (!event.buttons) {
      this.dragging = false;
    }

    if (!this.dragging) {
      return;
    }

    const [ax, ay] = this.toWorld([event.clientX, event.clientY]);
    const [bx, by] = this.toWorld([
      event.clientX + event.movementX,
      event.clientY + event.movementY
    ]);

    const [x, y] = this.position;
    this.position = [x + bx - ax, y + by - ay];
  };

  private toWorld(vertex: Vertex): Vertex {
    return this.transform(vertex, this.gRef!.getScreenCTM()!.inverse());
  }

  private toScreen(vertex: Vertex): Vertex {
    return this.transform(vertex, this.gRef!.getScreenCTM()!);
  }

  private transform(vertex: Vertex, matrix?: DOMMatrix): Vertex {
    const [x, y] = vertex;
    const point = new DOMPoint(x, y).matrixTransform(matrix);
    return [point.x, point.y];
  }
}
