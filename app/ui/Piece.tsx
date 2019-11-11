import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { centroid, radius } from "../math";
import { IPiece, Point } from "../model";
import { ClippedImage } from "./ClippedImage";
import { Draggable } from "./Draggable";

export interface IPieceProps {
  piece: IPiece;
  imageUrl: string;
  onMove: (_: { number: number; position: Point; rotation: number }) => void;
}

@observer
export class Piece extends Component<IPieceProps> {
  @observable
  private piece = this.props.piece;
  private combined = this.props.piece.shapes.reduce((a, b) => [...a, ...b]);
  private centroid = centroid(this.combined);
  private radius = radius(this.combined);

  public render() {
    const { imageUrl } = this.props;
    const { position, rotation, shapes } = this.piece;

    return (
      <Draggable
        position={position}
        rotation={rotation}
        center={this.centroid}
        radius={this.radius}
        onMove={this.onMove}
        onMoveEnd={this.onMoveEnd}
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
    const { piece } = this;
    this.piece = {
      ...piece,
      position,
      rotation
    };
  };

  private onMoveEnd = () => {
    const { piece } = this;
    const { onMove } = this.props;
    const { number, position, rotation } = piece;
    onMove({ number, position, rotation });
  };
}
