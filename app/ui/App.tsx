import * as React from "react";
import { useState } from "react";
import { style } from "typestyle";
import { generate } from "../generate";
import { IPuzzle } from "../model";
import { Puzzle } from "./Puzzle";
import { useAsyncEffect } from "./useAsyncEffect";

// TODO: Correct calculation of transforms?
// TODO: Perlin offset

const className = style({
  display: "flex",
  flex: 1
});

export function App() {
  const [puzzle, setPuzzle] = useState<IPuzzle | undefined>(undefined);

  useAsyncEffect(
    async () =>
      setPuzzle(await generate("https://i.imgur.com/VrA2kh1.jpg", 100)),
    []
  );

  return (
    <div className={className}>{puzzle && <Puzzle puzzle={puzzle} />}</div>
  );
}
