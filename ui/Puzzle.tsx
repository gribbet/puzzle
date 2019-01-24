import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { centroid, distance, normalizeAngle, radius } from "../math";
import { IPuzzle, Point } from "../model";
import { Piece } from "./Piece";
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
    const { pieces } = puzzle;

    return (
      <svg
        viewBox={`0 0 1 1`}
        width="100%"
        height="100%"
        style={{ background: "#e0e0e0" }}
      >
        <Zoomable>
          {pieces.map(piece => (
            <Piece
              key={piece.number}
              piece={piece}
              imageUrl={puzzle.url}
              onMove={this.onMovePiece}
            />
          ))}
        </Zoomable>
      </svg>
    );
  }

  private onMovePiece = ({
    number,
    position,
    rotation
  }: {
    number: number;
    position: Point;
    rotation: number;
  }) => {
    const { puzzle } = this.props;
    const { pieces } = puzzle;

    const piece = pieces.find(_ => _.number === number);
    if (!piece) {
      return;
    }

    const others = pieces.filter(_ => _ !== piece);

    const match = others.find(
      _ =>
        _ !== piece &&
        Math.abs(normalizeAngle(_.rotation - rotation)) < 30 &&
        distance(_.position, position) < 0.5 * radius(piece.shape) &&
        distance(centroid(_.shape), centroid(piece.shape)) <=
          radius(_.shape) + radius(piece.shape)
    );

    if (match) {
      position = match.position;
      rotation = match.rotation;
    }

    puzzle.pieces = [...others, { ...piece, position, rotation }];
  };
}
