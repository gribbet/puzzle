import * as React from "react";
import { PureComponent } from "react";
import { centroid, radius } from "../math";
import { IPiece, Point } from "../model";
import { ClippedImage } from "./ClippedImage";
import { Draggable } from "./Draggable";

export interface IPieceProps {
  piece: IPiece;
  imageUrl: string;
  onMove: (_: { number: number; position: Point; rotation: number }) => void;
}

export class Piece extends PureComponent<IPieceProps> {
  public render() {
    const { piece, imageUrl } = this.props;
    const { position, rotation, shapes } = piece;

    const combined = shapes.reduce((a, b) => [...a, ...b]);

    return (
      <Draggable
        position={position}
        rotation={rotation}
        center={centroid(combined)}
        radius={radius(combined)}
        onMove={this.onMove}
      >
        {shapes.map((shape, i) => (
          <ClippedImage key={i} imageUrl={imageUrl} shape={shape} />
        ))}
      </Draggable>
    );
  }

  private onMove = ({
    position,
    rotation
  }: {
    position: Point;
    rotation: number;
  }) => {
    const { piece, onMove } = this.props;
    const { number } = piece;
    onMove({ number, position, rotation });
  };
}
