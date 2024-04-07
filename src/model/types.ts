import { Grid } from '@/model/classes';

export type YX = {y: number, x: number};
export type PlayfieldYX = Tuple<Tuple<string, 20>, 10>;
export type DirectionGrids = {
  'up': Grid,
  'left': Grid,
  'right': Grid,
  'down': Grid,
}
export type Orientation = 'up' | 'down' | 'left' | 'right';
export type MovementDirection = 'left' | 'right' | 'down';
export type RotationDirection = 'left' | 'right';

type Tuple<
  T,
  N extends number,
  R extends T[] = [],
> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;