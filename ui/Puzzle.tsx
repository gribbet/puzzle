import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import {
  boundingRadius,
  centroid,
  distance,
  normalizeAngle,
  rotate
} from "../math";
import { IPiece, IPuzzle, Point } from "../model";
import { Piece } from "./Piece";
import { Zoomable } from "./Zoomable";

export interface IPuzzleProps {
  puzzle: IPuzzle;
}

@observer
export class Puzzle extends Component<IPuzzleProps> {
  @observable
  private puzzle: IPuzzle = this.props.puzzle;
  private centroids: { [number: number]: Point } = {};
  private radiuses: { [number: number]: number } = {};

  public render() {
    const { puzzle } = this;
    const { imageUrl: url, pieces } = puzzle;

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
              imageUrl={puzzle.imageUrl}
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
        Math.abs(normalizeAngle(_.rotation - rotation)) < 10 &&
        distance(rotate(_.position, _.rotation), rotate(position, rotation)) <
          0.01 &&
        distance(this.centroid(_), this.centroid(piece)) <=
          this.radius(_) + this.radius(piece)
    );

    if (match) {
      puzzle.pieces = [
        ...others.filter(_ => _ !== match),
        { ...match, shapes: [...match.shapes, ...piece.shapes] }
      ];
    } else {
      puzzle.pieces = [...others, { ...piece, position, rotation }];
    }
  };

  private centroid(piece: IPiece) {
    return (this.centroids[piece.number] =
      this.centroids[piece.number] ||
      centroid(piece.shapes.reduce((a, b) => [...a, ...b])));
  }

  private radius(piece: IPiece) {
    return (this.radiuses[piece.number] = boundingRadius(
      piece.shapes.reduce((a, b) => [...a, ...b])
    ));
  }
}
