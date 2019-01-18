import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component, MouseEvent, WheelEvent } from "react";
import * as React from "react";
import { style } from "typestyle";

import { IPuzzle, Point } from "./model";
import { Piece } from "./Piece";
import { generate } from "./generate";

@observer
export class Puzzle extends Component {
  private gRef?: SVGGElement;
  @observable
  private puzzle?: IPuzzle;
  @observable
  private scale = 1;
  @observable
  private position: Point = [0, 0];

  public async componentWillMount() {
    this.puzzle = await generate("https://i.redd.it/4st67jvypha21.jpg", 100);
  }

  public render() {
    const { position, puzzle } = this;
    const [x, y] = position;

    return (
      <svg
        className={style({
          width: "100%",
          height: "100%"
        })}
        viewBox="-0.5 -0.5 1 1"
        onWheel={this.onWheel}
      >
        <g
          ref={_ => (this.gRef = _ || undefined)}
          transform={`scale(${this.scale}) translate(${x - 0.5} ${y - 0.5})`}
        >
          {puzzle &&
            puzzle.pieces.map(piece => (
              <Piece
                key={piece.number}
                piece={piece}
                imageUrl={puzzle.url}
                onMove={({ position, rotation }) => {
                  piece.position = position;
                  piece.rotation = rotation;
                  puzzle.pieces = [
                    ...puzzle.pieces.filter(_ => _ !== piece),
                    piece
                  ];
                }}
              />
            ))}
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
