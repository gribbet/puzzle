import { Component, WheelEvent } from "react";
import * as React from "react";
import { style } from "typestyle";
import { observable, entries } from "mobx";
import { observer } from "mobx-react";
import { Polygon } from "./Polygon";
import { Piece } from "./Piece";
import { Pieces } from "./Pieces";
import { Vertex } from "./Vertex";

const puzzle = style({
  width: "100%",
  height: "100%"
});

const range = (start: number, end: number) =>
  end <= start ? [] : new Array(end - start).fill(0).map((_, i) => i + start);

const rows = 10;
const columns = 10;
const pieceHeight = 1 / rows;
const pieceWidth = 1 / columns;
const pieces: Polygon[] = range(0, rows)
  .map(i =>
    range(0, columns).map<Polygon>(j => [
      [i * pieceWidth, j * pieceHeight],
      [(i + 1) * pieceWidth, j * pieceHeight],
      [(i + 1) * pieceWidth, (j + 1) * pieceHeight],
      [i * pieceWidth, (j + 1) * pieceHeight]
    ])
  )
  .reduce((a, b) => [...a, ...b]);

@observer
export class Puzzle extends Component {
  private gRef?: SVGGElement;
  @observable
  private scale = 1;
  @observable
  private position: Vertex = [0, 0];

  public render() {
    const [x, y] = this.position;

    return (
      <svg className={puzzle} viewBox="-0.5 -0.5 1 1" onWheel={this.onWheel}>
        <g
          ref={_ => (this.gRef = _ || undefined)}
          transform={`scale(${this.scale}) translate(${x} ${y})`}
        >
          <Pieces pieces={pieces} />
        </g>
      </svg>
    );
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.ctrlKey) {
      const ds = this.scale * event.deltaY * 0.01;

      const [ax, ay] = this.toWorld([event.clientX, event.clientY]);

      const [bx, by] = [
        (ax / this.scale) * (this.scale - ds),
        (ay / this.scale) * (this.scale - ds)
      ];

      const [x, y] = this.position;
      this.position = [x + bx - ax, y + by - ay];

      this.scale -= ds;
    } else {
      const [ax, ay] = this.toWorld([event.clientX, event.clientY]);
      const [bx, by] = this.toWorld([
        event.clientX + event.deltaX,
        event.clientY + event.deltaY
      ]);

      const [x, y] = this.position;
      this.position = [x + bx - ax, y + by - ay];
    }
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
