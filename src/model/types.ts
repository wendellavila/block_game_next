import { Grid } from '@/model/classes';

export type XY = {x: number, y: number};
export type PlayfieldYX = Tuple<Tuple<string, 20>, 10>;

export type OrientationAll = 'up' | 'down' | 'left' | 'right';
export type OrientationTwo = 'upward' | 'sideways';
export type OrientationOnly = 'only';
export type Orientation = OrientationAll | OrientationTwo | OrientationOnly;
export type OrientationGridsAll = {
  'up': Grid,
  'left': Grid,
  'right': Grid,
  'down': Grid,
}
export type OrientationGridsTwo = {
  'upward': Grid,
  'sideways': Grid
}
export type OrientationGridsOnly = {
  'only': Grid
}
export type OrientationGrids = OrientationGridsAll | OrientationGridsTwo | OrientationGridsOnly;

export type MovementDirection = 'left' | 'right' | 'down';
export type RotationDirection = 'left' | 'right';
export type BlockActionType = 'movement' | 'rotation';

type Tuple<
  T,
  N extends number,
  R extends T[] = [],
> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;