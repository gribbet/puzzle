import * as React from "react";
import { useCallback, useState } from "react";
import { style } from "typestyle";
import {
  boundingRadius,
  centroid,
  length,
  normalizeAngle,
  subtract
} from "../math";
import { IPiece, IPuzzle, Point, Shape } from "../model";
import { Piece } from "./Piece";
import { Zoomable } from "./Zoomable";

const className = style({
  background: `#101010`
});

export interface IPuzzleProps {
  puzzle: IPuzzle;
}

export function Puzzle(props: IPuzzleProps) {
  const [puzzle, setPuzzle] = useState(props.puzzle);

  const { imageUrl, pieces } = puzzle;

  const onMovePiece = useCallback(
    ({
      number,
      position,
      rotation
    }: {
      number: number;
      position: Point;
      rotation: number;
    }) => {
      const { pieces } = puzzle;

      const piece = pieces.find(_ => _.number === number);
      if (!piece) {
        return;
      }

      const others = pieces.filter(_ => _ !== piece);

      const angleThreshold = 10;
      const distanceThreshold = 0.01;

      const angle = (_: IPiece) => {
        const angle = normalizeAngle(_.rotation - rotation);
        return Math.min(angle, 360 - angle);
      };

      const distance = (_: IPiece) => length(subtract(_.position, position));

      const adjacentShape = (a: Shape, b: Shape) =>
        length(subtract(centroid(a), centroid(b))) <=
        boundingRadius(a) + boundingRadius(b);

      const adjacent = (_: IPiece) =>
        piece.shapes
          .map(a => _.shapes.map(b => [a, b]))
          .reduce((a, b) => [...a, ...b])
          .reduce((adjacent, [a, b]) => adjacent || adjacentShape(a, b), false);

      const match = others.find(
        _ =>
          angle(_) < angleThreshold &&
          distance(_) < distanceThreshold &&
          adjacent(_)
      );

      setPuzzle({
        ...puzzle,
        pieces: [
          ...others.filter(_ => _ !== match),
          {
            ...piece,
            position,
            rotation,
            shapes: [...piece.shapes, ...(match ? match.shapes : [])]
          }
        ]
      });
    },
    [puzzle]
  );

  return (
    <svg viewBox={`0 0 1 1`} width="100%" height="100%" className={className}>
      <Zoomable>
        {pieces.map(piece => (
          <Piece
            key={`${piece.number}-${piece.shapes.length}`}
            piece={piece}
            imageUrl={imageUrl}
            onMove={onMovePiece}
          />
        ))}
      </Zoomable>
    </svg>
  );
}
