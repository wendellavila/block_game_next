import { BlockLayout, Orientation, YX } from "@/model/types";

export interface Block {
  layout: BlockLayout;
  orientation: Orientation;
  anchorPosition: YX;
  canPlace: (playfield: string[][]) => boolean;
  canMoveDown: (playfield: string[][]) => boolean;
  canMoveLeft: (playfield: string[][]) => boolean;
  canMoveRight: (playfield: string[][]) => boolean;
  canRotateLeft: (playfield: string[][]) => boolean;
  canRotateRight: (playfield: string[][]) => boolean;
}