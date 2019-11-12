import { add, centroid, rotate, subtract } from "./math";
import { IPiece, IPuzzle, Point, Shape } from "./model";
import { range } from "./util";

export async function generate(
  imageUrl: string,
  count: number
): Promise<IPuzzle> {
  const image = await loadImage(imageUrl);
  const { width, height } = image;
  const aspect = width / height;
  const columns = Math.round(Math.sqrt(count * aspect));
  const rows = Math.round(columns / aspect);

  const tall = height > width;

  const pieceHeight = 1 / (tall ? 1 : aspect) / rows;
  const pieceWidth = (1 * (tall ? aspect : 1)) / columns;

  const size = Math.sqrt(pieceWidth * pieceWidth + pieceHeight * pieceHeight);

  const offsetX = tall ? (1 - aspect) / 2 : 0;
  const offsetY = tall ? 0 : (1 - 1 / aspect) / 2;

  const flips = range(0, columns + 1).map(_ =>
    range(0, rows + 1).map(_ => range(0, 2).map(_ => Math.random() < 0.5))
  );

  const horizontal = (i: number, j: number) =>
    (j === 0 || j === rows ? edge : flips[i][j][0] ? flipped : shape).map<
      Point
    >(([x, y]) => [
      (x + i) * pieceWidth + offsetX,
      (y + j) * pieceHeight + offsetY
    ]);

  const vertical = (i: number, j: number) =>
    (i === 0 || i === columns ? edge : flips[i][j][1] ? flipped : shape).map<
      Point
    >(([x, y]) => [
      (y + i) * pieceWidth + offsetX,
      (x + j) * pieceHeight + offsetY
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

        const rotation = (Math.random() - 0.5) * 360;

        return {
          number: j * columns + i,
          position: add(
            rotate(
              [
                Math.random() * (1 - size) + size / 2,
                Math.random() * (1 - size) + size / 2
              ],
              -rotation
            ),
            subtract([0, 0], centroid(shape))
          ),
          rotation,
          shapes: [shape]
        };
      })
    )
    .reduce((a, b) => [...a, ...b]);

  console.log(`Generated puzzle width ${rows * columns} pieces`);

  return { imageUrl, pieces };
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

const flipped = shape.map(([x, y]) => [x, -y]);
