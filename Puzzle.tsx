import { Component, WheelEvent } from "react";
import * as React from "react";
import { style } from "typestyle";
import { observable, entries } from "mobx";
import { observer } from "mobx-react";
import { Polygon } from "./Polygon";
import { Piece } from "./Piece";
import { Pieces } from "./Pieces";

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
  @observable
  private scale = 1;
  @observable
  private x = 0;
  @observable
  private y = 0;

  public render() {
    return (
      <svg className={puzzle} viewBox="0 0 1 1" onWheel={this.onWheel}>
        <g transform={`translate(${this.x} ${this.y}) scale(${this.scale})`}>
          <Pieces pieces={pieces} />
        </g>
      </svg>
    );
  }

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.ctrlKey) {
      this.scale -= this.scale * event.deltaY * 0.01;
    } else {
      const factor = 0.001;
      this.x += event.deltaX * factor;
      this.y += event.deltaY * factor;
    }
  };
}
