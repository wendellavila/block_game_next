import { XY } from '@/typing/types';
import { 
  OrientationGrids,OrientationGridsAll,OrientationGridsOnly,OrientationGridsTwo,
  Orientation,OrientationAll,OrientationTwo,OrientationOnly,
  MovementDirection,RotationDirection
} from '@/typing/types';
import Grid from '@/classes/grid';

export default abstract class Block {
  protected orientationGrids: OrientationGrids;
  protected orientation: Orientation;
  position: XY; // relative to playfield width and layout height
  playfield: Grid;
  constructor(layouts: string[][][], playfield: Grid){
    this.playfield = playfield;

    if(layouts.length === 1){
      this.orientationGrids = <OrientationGridsOnly>{
        only: new Grid({values: layouts[0]}),
      }
      this.orientation = 'only' as OrientationOnly;
    }
    else if(layouts.length === 2){
      this.orientationGrids = <OrientationGridsTwo>{
        upward: new Grid({values: layouts[0]}),
        sideways: new Grid({values: layouts[1]})
      }
      this.orientation = 'upward' as OrientationTwo;
    }
    else {
      this.orientationGrids = <OrientationGridsAll>{
        up: new Grid({values: layouts[0]}),
        right: new Grid({values: layouts[1]}),
        down: new Grid({values: layouts[2]}),
        left: new Grid({values: layouts[3]})
      }
      this.orientation = 'up' as OrientationAll;
    }

    this.position = <XY>{
      x: Math.floor(playfield.width/2)-this.width+1,
      y: -this.height+1
    }
  }

  getXY(position: XY) : string {
    return this.grid.getXY({x: position.x, y: position.y});
  }

  get grid() : Grid {
    if('only' in this.orientationGrids){
      return this.orientationGrids['only'];
    }
    else if('upward' in this.orientationGrids){
      return this.orientationGrids[this.orientation as OrientationTwo];
    }
    else {
      return this.orientationGrids[this.orientation as OrientationAll];
    }
  }
  get height() : number {
    return this.grid.height;
  }
  get width() : number {
    return this.grid.width;
  }
  get y() : number {
    return this.position.y;
  }
  get x() : number {
    return this.position.x;
  }

  /**
   * Checks if block can be placed in the first row of playfield
   * @returns {boolean} Placement status
   */
  canPlace() : boolean {
    // Start position of last row of layout
    const layoutY = this.height-1;
    // Start position of first row of playfield
    const playfieldX = Math.floor(this.playfield.width/2)-this.width+1

    for(let i = 0; i < this.width; i++){
      const isLayoutPixelNotEmpty = this.getXY({x: i, y: layoutY}) !== ' ';
      const isPlayfieldPixelNotEmpty = this.playfield.getXY({x: playfieldX+i, y: 0}) !== ' ';
      if(isLayoutPixelNotEmpty && isPlayfieldPixelNotEmpty){
        return false;
      }
    }
    return true;
  }

  /**
   * Simulates a move and checks if there's overlap after the move
   * @param {MovementDirection} direction - left, right, or down.
   * @returns {boolean} Success status
   */
  tryMove(direction: MovementDirection) : boolean {
    let tempPosition: XY;
    if(direction === 'down'){
      const hasNextRow: boolean = this.y + this.height < this.playfield.height;
      if(!hasNextRow) return false;
      tempPosition = {y: this.position.y+1, x: this.position.x};
    }
    else if(direction === 'left'){
      const hasPrevCol: boolean = this.x - 1 >= 0;
      if(!hasPrevCol) return false;
      tempPosition = {y: this.position.y, x: this.position.x-1};
    }
    else { // right
      const hasNextCol: boolean = this.x + this.width < this.playfield.width;
      if(!hasNextCol) return false;
      tempPosition = {y: this.position.y, x: this.position.x+1};
    }

    let tempPlayfield: Grid = new Grid({values: structuredClone(this.playfield.values)});
    //Remove current block from playfield
    tempPlayfield.setValues(
      new Grid({width: this.width, height: this.height}),
      this.position
    );
    //Check if block overlaps filled positions of playfield after move
    for(let y = 0; y < this.height; y++){
      if(y+tempPosition.y < 0) continue;
      for(let x = 0; x < this.width; x++){
        const playfieldPixel = tempPlayfield.getXY({x: x+tempPosition.x,y: y+tempPosition.y});
        //const blockPixel = this.getXY({x,y});
        if(playfieldPixel !== ' '){
          return false;
        }
      }
    }
    //Commits move
    tempPlayfield.setValues(this.grid, tempPosition);
    this.position = {y: tempPosition.y, x: tempPosition.x};
    this.playfield.setValues(tempPlayfield, {y: 0, x: 0});
    return true;
  }
  tryRotate(direction: RotationDirection): boolean {
    if('only' in this.orientationGrids){
      return false;
    }
    else if('upward' in this.orientationGrids){
      return this.tryRotateTwo(direction);
    }
    else {
      return this.tryRotateAll(direction);
    }
  }

  tryRotateTwo(direction: RotationDirection): boolean {
    return false;
  }

  tryRotateAll(direction: RotationDirection): boolean {
    if(!('up' in this.orientationGrids)){
      return false;
    }
    let tempOrientation: OrientationAll;
    let tempPosition: XY = {y: this.position.y, x: this.position.x};
    if(direction === 'right'){
      if(this.orientation === 'up'){
        tempOrientation = 'right';
        tempPosition = {y: tempPosition.y, x: tempPosition.x+1};
      }
      else if(this.orientation === 'right'){
        tempOrientation = 'down';
        tempPosition = {y: tempPosition.y+1, x: tempPosition.x-1};
      }
      else if(this.orientation === 'down'){
        tempOrientation = 'left';
        tempPosition = {y: tempPosition.y, x: tempPosition.x};
      }
      else {
        tempOrientation = 'up';
        tempPosition = {y: tempPosition.y, x: tempPosition.x};
      }
    }
    else {
      if(this.orientation === 'up'){
        tempOrientation = 'left';
        tempPosition = {y: tempPosition.y, x: tempPosition.x};
      }
      else if(this.orientation === 'left'){
        tempOrientation = 'down';
        tempPosition = {y: tempPosition.y+1, x: tempPosition.x};
      }
      else if(this.orientation === 'down'){
        tempOrientation = 'right';
        tempPosition = {y: tempPosition.y, x: tempPosition.x+1};
      }
      else {
        tempOrientation = 'up';
        tempPosition = {y: tempPosition.y, x: tempPosition.x-1};
      }
    }
    
    let tempPlayfield: Grid = new Grid({values: structuredClone(this.playfield.values)});
    //Remove current block from playfield
    tempPlayfield.setValues(
      new Grid({width: this.width, height: this.height}),
      this.position
    );
    const tempBlockGrid = this.orientationGrids[tempOrientation];
    //Check if block overlaps filled positions of playfield after move
    for(let y = 0; y < tempBlockGrid.height; y++){
      if(y+tempPosition.y < 0) continue;
      for(let x = 0; x < tempBlockGrid.width; x++){
        const playfieldPixel = tempPlayfield.getXY({x: x+tempPosition.x,y: y+tempPosition.y});
        //const blockPixel = tempBlockGrid.getXY({x,y});
        if(playfieldPixel !== ' '){
          return false;
        }
      }
    }
    //Commits rotation
    tempPlayfield.setValues(tempBlockGrid, tempPosition);
    this.orientation = tempOrientation;
    this.position = {y: tempPosition.y, x: tempPosition.x};
    this.playfield.setValues(tempPlayfield, {y: 0, x: 0});
    return true;
  };
}

export class Square_Block extends Block {
  constructor(playfield: Grid){
    const layouts = [
      [
        ['#','#'],
        ['#','#']
      ]
    ];
    super(layouts, playfield);
  }
}

export class I_Block extends Block {
  constructor(playfield: Grid){
    const layouts = [
      [
        ['I','I','I','I']
      ],
      [
        ['I'],
        ['I'],
        ['I'],
        ['I']
      ]
    ];
    super(layouts, playfield);
  }
}

export class Z_Block extends Block {
  constructor(playfield: Grid){
    const layouts = [
      [
        ['Z','Z',' '],
        [' ','Z','Z']
      ],
      [
        [' ','Z'],
        ['Z','Z'],
        ['Z',' ']
      ]
    ];
    super(layouts, playfield);
  }
}

export class S_Block extends Block {
  constructor(playfield: Grid){
    const layouts = [
      [
        [' ','S','S'],
        ['S','S',' ']
      ],
      [
        ['S',' '],
        ['S','S'],
        [' ','S']
      ]
    ];
    super(layouts, playfield);
  }
}

export class L_Block extends Block {
  constructor(playfield: Grid){

    const layouts: string[][][] = [
      [
        [' ',' ','L'],
        ['L','L','L']
      ],
      [
        ['L','L'],
        [' ','L'],
        [' ','L']
      ],
      [
        ['L','L','L'],
        ['L',' ',' ']
      ],
      [
        ['L',' '],
        ['L',' '],
        ['L','L']
      ]
    ];
    super(layouts, playfield);
  }
}

export class L2_Block extends Block {
  constructor(playfield: Grid){
    const layouts: string[][][] = [
      [
        ['l','l','l'],
        [' ',' ','l']
      ],
      [
        [' ','l'],
        [' ','l'],
        ['l','l']
      ],
      [
        ['l',' ',' '],
        ['l','l','l']
      ],
      [
        ['l','l'],
        ['l',' '],
        ['l',' ']
      ]
    ];
    super(layouts, playfield);
  }
}

export class T_Block extends Block {
  constructor(playfield: Grid){

    const layouts: string[][][] = [
      [
        ['T','T','T'],
        [' ','T',' ']
      ],
      [
        [' ','T'],
        ['T','T'],
        [' ','T']
      ],
      [
        [' ','T',' '],
        ['T','T','T']
      ],
      [
        ['T',' '],
        ['T','T'],
        ['T',' ']
      ]
    ];
    super(layouts, playfield);
  }
}