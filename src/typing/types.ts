import Grid from '@/classes/grid';

export type XY = {x: number, y: number};

export type OrientationAll = 'up' | 'down' | 'left' | 'right';
export type OrientationTwo = 'upward' | 'sideways';
export type OrientationOnly = 'only';
export type Orientation = OrientationAll | OrientationTwo | OrientationOnly;

export type OrientationGridsOnly = {
  'only': Grid
}
export type OrientationGridsTwo = {
  'upward': Grid,
  'sideways': Grid
}
export type OrientationGridsAll = {
  'up': Grid,
  'left': Grid,
  'right': Grid,
  'down': Grid,
}
export type OrientationGrids = OrientationGridsAll | OrientationGridsTwo | OrientationGridsOnly;

export type MovementDirection = 'left' | 'right' | 'down';
export type RotationDirection = 'left' | 'right';
export type BlockActionType = 'movement' | 'rotation';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;