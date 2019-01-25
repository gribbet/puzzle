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
    const { position, rotation, shape } = piece;

    return (
      <Draggable
        position={position}
        rotation={rotation}
        center={centroid(shape)}
        radius={radius(shape)}
        onMove={this.onMove}
      >
        <ClippedImage imageUrl={imageUrl} shape={shape} />
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
