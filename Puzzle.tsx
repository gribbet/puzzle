import { Component, WheelEvent, MouseEvent } from "react";
import * as React from "react";
import { style } from "typestyle";
import { observable, entries } from "mobx";
import { observer } from "mobx-react";
import { Piece } from "./Piece";
import { Point, IPiece } from "./model";
import {
  centroid,
  angle,
  rotate,
  dot,
  perpendicular,
  subtract,
  add
} from "./math";

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
const pieces: IPiece[] = range(0, rows)
  .map(i =>
    range(0, columns).map<IPiece>(j => ({
      position: [0, 0],
      rotation: 0,
      shape: [
        [i * pieceWidth, j * pieceHeight],
        [(i + 1) * pieceWidth, j * pieceHeight],
        [(i + 1) * pieceWidth, (j + 1) * pieceHeight],
        [i * pieceWidth, (j + 1) * pieceHeight]
      ]
    }))
  )
  .reduce((a, b) => [...a, ...b]);

@observer
export class Puzzle extends Component {
  private gRef?: SVGGElement;
  @observable
  private pieces: IPiece[] = pieces;
  @observable
  private scale = 1;
  @observable
  private position: Point = [0, 0];
  @observable
  private dragging?: number;
  @observable
  private dragStart: Point = [0, 0];

  public render() {
    const [x, y] = this.position;

    const onMouseDown = (i: number) => ({ clientX, clientY }: MouseEvent) => {
      this.dragging = i;
      const { shape, position: offset, rotation } = this.pieces[i];

      this.dragStart = rotate(
        subtract(
          subtract(this.toLocal([clientX, clientY]), centroid(shape)),
          offset
        ),
        -rotation
      );
    };

    return (
      <svg className={puzzle} viewBox="-0.5 -0.5 1 1" onWheel={this.onWheel}>
        <g
          ref={_ => (this.gRef = _ || undefined)}
          transform={`scale(${this.scale}) translate(${x - 0.5} ${y - 0.5})`}
        >
          {this.pieces.map((piece, i) => (
            <Piece
              key={i}
              index={i}
              piece={piece}
              imageUrl="https://i.redd.it/4st67jvypha21.jpg"
            />
          ))}
          {this.dragging && (
            <use href={`#piece-${this.dragging}`} pointerEvents="none" />
          )}
        </g>
      </svg>
    );
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
    return this.transform(point, this.gRef!.getScreenCTM()!.inverse());
  }

  private transform(point: Point, matrix?: DOMMatrix): Point {
    const [x0, y0] = point;
    const { x, y } = new DOMPoint(x0, y0).matrixTransform(matrix);
    return [x, y];
  }
}
