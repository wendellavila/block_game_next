export type YX = [number, number];
export type PlayfieldYX = Tuple<Tuple<string, 20>, 10>;
export type BlockLayout = Tuple<Tuple<string, 4>, 4>;
export type Orientation = 'up' | 'down' | 'left' | 'right';

type Tuple<
  T,
  N extends number,
  R extends T[] = [],
> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;