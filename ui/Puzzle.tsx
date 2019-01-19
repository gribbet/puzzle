import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component, MouseEvent, WheelEvent } from "react";
import * as React from "react";
import { style } from "typestyle";

import { IPuzzle, Point, IPiece } from "../model";
import { Piece } from "./Piece";
import { generate } from "../generate";
import { Zoomable } from "./Zoomable";
import { distance, radius, centroid } from "../math";

export interface IPuzzleProps {
  puzzle: IPuzzle;
}

@observer
export class Puzzle extends Component<IPuzzleProps> {
  @observable
  private puzzle: IPuzzle = this.props.puzzle;

  public render() {
    const { puzzle } = this;
    const { pieces } = puzzle;

    return (
      <svg viewBox={`0 0 1 1`} width="100%" height="100%">
        <Zoomable>
          {pieces.map(piece => (
            <Piece
              key={piece.number}
              piece={piece}
              imageUrl={puzzle.url}
              onMove={this.onMovePiece(piece)}
            />
          ))}
        </Zoomable>
      </svg>
    );
  }

  private onMovePiece = (piece: IPiece) => ({
    position,
    rotation
  }: {
    position: Point;
    rotation: number;
  }) => {
    const { puzzle } = this.props;
    const { pieces } = puzzle;

    const others = pieces.filter(_ => _ !== piece);

    const match = others.find(
      _ =>
        _ !== piece &&
        Math.abs(_.rotation - rotation) < 10 &&
        distance(_.position, position) < 0.01 &&
        distance(centroid(_.shape), centroid(piece.shape)) <=
          radius(_.shape) + radius(piece.shape)
    );

    if (match) {
      position = match.position;
      rotation = match.rotation;
    }

    piece.position = position;
    piece.rotation = rotation;

    puzzle.pieces = [...others, piece];
  };
}
