import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { centroid, meanSquaredRadius } from "../math";
import { IPiece, Point } from "../model";
import { ClippedImage } from "./ClippedImage";
import { Draggable } from "./Draggable";

export interface IPieceProps {
  piece: IPiece;
  imageUrl: string;
  onMove: (_: { number: number; position: Point; rotation: number }) => void;
}

export function Piece(props: IPieceProps) {
  const { imageUrl } = props;

  const combined = useMemo(
    () => props.piece.shapes.reduce((a, b) => [...a, ...b]),
    [props.piece]
  );
  const center = useMemo(() => centroid(combined), [combined]);
  const radius = useMemo(() => meanSquaredRadius(combined), [combined]);

  const [piece, setPiece] = useState(props.piece);

  const { position, rotation, shapes } = piece;

  const onMove = useCallback(
    ({ position, rotation }: { position: Point; rotation: number }) => {
      setPiece({
        ...piece,
        position,
        rotation
      });
    },
    [piece]
  );

  const onMoveEnd = useCallback(() => {
    const { number, position, rotation } = piece;
    props.onMove({ number, position, rotation });
  }, [piece]);

  return (
    <Draggable
      position={position}
      rotation={rotation}
      center={center}
      radius={radius}
      onMove={onMove}
      onMoveEnd={onMoveEnd}
    >
      {shapes.map((shape, i) => (
        <ClippedImage key={i} imageUrl={imageUrl} shape={shape} />
      ))}
    </Draggable>
  );
}
