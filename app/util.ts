export const range = (start: number, end: number) =>
  end <= start ? [] : new Array(end - start).fill(0).map((_, i) => i + start);

export const format = (x: number) => x.toPrecision(4);
