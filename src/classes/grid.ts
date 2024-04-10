import { XY } from '@/typing/types';
import { defaultPlayfieldSize } from '@/utils/constants';

export default class Grid {
  values: string[][];

  constructor(args: {width?: number, height?: number, values?: string[][]}){
    if(args.values){
      this.values = args.values;
    }
    else {
      this.values = Array.from(
        Array<number>(args.height ?? defaultPlayfieldSize.height),
        (_) => Array.from(
          Array<number>(args.width ?? defaultPlayfieldSize.width), (_) => ' '
        )
      )
    }
  }

  getXY(position: XY) : string {
    return this.values[position.y][position.x];
  }

  getRow(y: number) : string[] {
    return this.values[y];
  }

  get width(){
    return this.values[0] ? this.values[0].length : 0;
  }

  get height(){
    return this.values.length;
  }

  setValues(values: Grid, startPosition: XY) : void {
    const yStart = Math.max(startPosition.y, 0);
    const yEnd = Math.min(startPosition.y+values.height, this.height);

    const xStart = Math.max(startPosition.x, 0);
    const xEnd = Math.min(startPosition.x+values.width, this.width);

    for(let y = yStart; y < yEnd; y++){
      for(let x = xStart; x < xEnd; x++){
        this.values[y][x] = values.getXY({
          x: x-startPosition.x,
          y: y-startPosition.y
        });
      }
    }
  }
}