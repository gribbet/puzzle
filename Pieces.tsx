import { PureComponent } from "react";
import * as React from "react";

import { Piece } from "./Piece";
import { Polygon } from "./Polygon";

export interface IPiecesProps {
  pieces: Polygon[];
}

export class Pieces extends PureComponent<IPiecesProps> {
  public render() {
    const { pieces } = this.props;

    return (
      <g>
        {pieces.map((piece, i) => (
          <Piece
            key={i}
            index={i}
            shape={piece}
            imageUrl="https://i.redd.it/4st67jvypha21.jpg"
          />
        ))}
      </g>
    );
  }
}
