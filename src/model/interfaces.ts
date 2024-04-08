import { BlockLayout, Orientation, XY } from "@/model/types";

export interface Block {
  layout: BlockLayout;
  orientation: Orientation;
  anchorPosition: XY;
  canPlace: (playfield: string[][]) => boolean;
  canMoveDown: (playfield: string[][]) => boolean;
  canMoveLeft: (playfield: string[][]) => boolean;
  canMoveRight: (playfield: string[][]) => boolean;
  canRotateLeft: (playfield: string[][]) => boolean;
  canRotateRight: (playfield: string[][]) => boolean;
}