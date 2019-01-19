import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component, MouseEvent, WheelEvent } from "react";
import * as React from "react";
import { style } from "typestyle";

import { IPuzzle, Point } from "../model";
import { Piece } from "./Piece";
import { generate } from "../generate";
import { Zoomable } from "./Zoomable";

export interface IPuzzleProps {
  puzzle: IPuzzle;
}

@observer
export class Puzzle extends Component<IPuzzleProps> {
  @observable
  private puzzle: IPuzzle = this.props.puzzle;

  public render() {
    const { puzzle } = this;

    return (
      <svg viewBox={`0 0 1 1`} width="100%" height="100%">
        <Zoomable>
          {puzzle.pieces.map(piece => (
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
        </Zoomable>
      </svg>
    );
  }
}
