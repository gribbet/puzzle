import { IPiece, IPuzzle } from "./model";

export async function generate(url: string, count: number): Promise<IPuzzle> {
  const image = await loadImage(url);
  const { width, height } = image;
  const aspect = width / height;
  const columns = Math.round(Math.sqrt(count * aspect));
  const rows = Math.round(columns / aspect);
  console.log(count, rows * columns);

  const pieceHeight = 1 / aspect / rows;
  const pieceWidth = 1 / columns;
  const offset = (1 - 1 / aspect) / 2;
  const pieces = range(0, columns)
    .map(i =>
      range(0, rows).map<IPiece>(j => ({
        number: i * columns + j,
        position: [0, 0],
        rotation: 0,
        shape: [
          [i * pieceWidth, j * pieceHeight + offset],
          [(i + 1) * pieceWidth, j * pieceHeight + offset],
          [(i + 1) * pieceWidth, (j + 1) * pieceHeight + offset],
          [i * pieceWidth, (j + 1) * pieceHeight + offset]
        ]
      }))
    )
    .reduce((a, b) => [...a, ...b]);

  return { url, pieces };
}

const range = (start: number, end: number) =>
  end <= start ? [] : new Array(end - start).fill(0).map((_, i) => i + start);

async function loadImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  const loaded = new Promise(resolve => (image.onload = resolve));
  image.src = url;
  await loaded;
  return image;
}
