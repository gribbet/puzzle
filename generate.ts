import { IPiece, IPuzzle, Point, Shape } from "./model";
import { range } from "./util";

export async function generate(url: string, count: number): Promise<IPuzzle> {
  const image = await loadImage(url);
  const { width, height } = image;
  const aspect = width / height;
  const columns = Math.round(Math.sqrt(count * aspect));
  const rows = Math.round(columns / aspect);

  const pieceHeight = 1 / aspect / rows;
  const pieceWidth = 1 / columns;
  const offset = (1 - 1 / aspect) / 2;

  const horizontal = (i: number, j: number) =>
    (j === 0 || j === rows ? edge : shape).map<Point>(([x, y]) => [
      (x + i) * pieceWidth,
      (y + j) * pieceHeight + offset
    ]);

  const vertical = (i: number, j: number) =>
    (i === 0 || i === columns ? edge : shape).map<Point>(([x, y]) => [
      (y + i) * pieceWidth,
      (x + j) * pieceHeight + offset
    ]);

  const pieces = range(0, columns)
    .map(i =>
      range(0, rows).map<IPiece>(j => {
        const shape: Shape = [
          ...horizontal(i, j),
          ...vertical(i + 1, j).slice(1),
          ...horizontal(i, j + 1)
            .reverse()
            .slice(1),
          ...vertical(i, j)
            .reverse()
            .slice(1)
        ];

        return {
          number: i * columns + j,
          position: [0, 0],
          rotation: 0,
          shape
        };
      })
    )
    .reduce((a, b) => [...a, ...b]);

  console.log(`Generated puzzle width ${rows * columns} pieces`);

  return { url, pieces };
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  const loaded = new Promise(resolve => (image.onload = resolve));
  image.src = url;
  await loaded;
  return image;
}

const edge: Shape = [[0, 0], [1, 0], [1, 0], [1, 0]];

const shape: Shape = [
  [0, 0],
  [0.28, 0],
  [0.28, 0],
  [0.28, 0],
  [0.35, 0],
  [0.3746, 0.025],
  [0.3625, 0.0775],
  [0.3544, 0.1125],
  [0.35, 0.12],
  [0.35, 0.15],
  [0.35, 0.233],
  [0.417, 0.3],
  [0.5, 0.3],
  [0.583, 0.3],
  [0.65, 0.233],
  [0.65, 0.15],
  [0.65, 0.12],
  [0.6456, 0.1125],
  [0.6375, 0.0775],
  [0.6254, 0.025],
  [0.65, 0],
  [0.72, 0],
  [1, 0],
  [1, 0],
  [1, 0]
];
