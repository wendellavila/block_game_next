import { XY } from "@/model/types";
import { defaultPlayfieldSize, sleep, waitKeyPress } from "./constants";
import { 
  BlockActionType,
  OrientationGrids,OrientationGridsAll,OrientationGridsOnly,OrientationGridsTwo,
  Orientation,OrientationAll,OrientationTwo,OrientationOnly,
  MovementDirection,RotationDirection
} from "@/model/types";

abstract class Block {
  protected orientationGrids: OrientationGrids;
  protected orientation: Orientation;
  position: XY; // relative to playfield width and layout height
  playfield: Grid;
  constructor(layouts: OrientationGrids, playfield: Grid){
    this.orientationGrids = layouts;
    this.playfield = playfield;

    if('only' in this.orientationGrids){
      this.orientation = 'only' as OrientationOnly;
    }
    else if('upward' in this.orientationGrids){
      this.orientation = 'upward' as OrientationTwo;
    }
    else {
      this.orientation = 'up' as OrientationAll;
    }

    this.position = {
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
    const yStart = Math.max(tempPosition.y, 0);
    const yEnd = Math.min(tempPosition.y+this.height, this.playfield.height);
    const xStart = Math.max(tempPosition.x, 0);
    const xEnd = Math.min(tempPosition.x+this.width, this.playfield.width);
    for(let y = yStart; y < yEnd; y++){
      for(let x = xStart; x < xEnd; x++){
        const playfieldPixel = tempPlayfield.getXY({x,y});
        if(playfieldPixel !== ' '){
          return false;
        }
      }
    }
    //Commits move
    tempPlayfield.setValues(this.grid, tempPosition);
    this.position = tempPosition;
    this.playfield.setValues(tempPlayfield, {y: 0, x: 0});
    return true;
  }
  abstract tryRotate(direction: RotationDirection): boolean;

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
        tempPosition = {y: tempPosition.y-2, x: tempPosition.x-1};
      }
      else if(this.orientation === 'down'){
        tempOrientation = 'left';
        tempPosition = {y: tempPosition.y+2, x: tempPosition.x};
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
        tempPosition = {y: tempPosition.y+2, x: tempPosition.x};
      }
      else if(this.orientation === 'down'){
        tempOrientation = 'right';
        tempPosition = {y: tempPosition.y-2, x: tempPosition.x+1};
      }
      else {
        tempOrientation = 'up';
        tempPosition = {y: tempPosition.y, x: tempPosition.x-1};
      }
    }

    if(tempPosition.y < 0) tempPosition.y = 0;
    else if(tempPosition.y > this.height-1) tempPosition.y = this.height-1;
    if(tempPosition.x < 0) tempPosition.x = 0;
    else if(tempPosition.x > this.width-1) tempPosition.x = this.width-1;
    
    let tempPlayfield: Grid = new Grid({values: structuredClone(this.playfield.values)});
    //Remove current block from playfield
    tempPlayfield.setValues(
      new Grid({width: this.width, height: this.height}),
      this.position
    );
    const tempBlockGrid = this.orientationGrids[tempOrientation];

    //Check if block overlaps filled positions of playfield after move
    const yStart = Math.max(tempPosition.y, 0);
    const yEnd = Math.min(tempPosition.y+tempBlockGrid.height, tempPlayfield.height);
    const xStart = Math.max(tempPosition.x, 0);
    const xEnd = Math.min(tempPosition.x+tempBlockGrid.width, tempPlayfield.width);
    for(let y = yStart; y < yEnd; y++){
      for(let x = xStart; x < xEnd; x++){
        const playfieldPixel = tempPlayfield.getXY({x,y});
        if(playfieldPixel !== ' '){
          return false;
        }
      }
    }
    //Commits rotation
    tempPlayfield.setValues(tempBlockGrid, tempPosition);
    this.position = tempPosition;
    this.playfield.setValues(tempPlayfield, {y: 0, x: 0});
    this.orientation = tempOrientation;
    return true;
  };

}

class Square extends Block {
  constructor(playfield: Grid){
    const layout: Grid = new Grid({values: [
      ['#','#'],
      ['#','#']
    ]});
    const layouts: OrientationGridsOnly = {
      only: layout
    }
    super(layouts, playfield);
  }
  tryRotate(_: RotationDirection) : boolean {
    return false;
  }
}

class T extends Block {
  constructor(playfield: Grid){
    const layoutUp: Grid = new Grid({values: [
      ['T','T','T'],
      [' ','T',' ']
    ]});
    const layoutDown: Grid = new Grid({values: [
      [' ','T',' '],
      ['T','T','T']
    ]});
    const layoutLeft: Grid = new Grid({values: [
      ['T',' '],
      ['T','T'],
      ['T',' ']
    ]});

    const layoutRight: Grid = new Grid({values: [
      [' ','T'],
      ['T','T'],
      [' ','T']
    ]});

    const layouts: OrientationGridsAll = {
      up: layoutUp,
      left: layoutLeft,
      right: layoutRight,
      down: layoutDown,
    }
    super(layouts, playfield);
  }
  tryRotate(direction: RotationDirection) : boolean {
    return this.tryRotateAll(direction);
  }
}

export class Grid {
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

export class Game {
  private playfield: Grid;
  private score: number;
  private rowsCleared: number;
  private nextBlocks: Block[];
  private setPlayfieldCallback: React.Dispatch<React.SetStateAction<string[][]|undefined>>;
  private setScoreCallback: React.Dispatch<React.SetStateAction<number|undefined>>;

  constructor(
    setPlayfieldCallback: React.Dispatch<React.SetStateAction<string[][]|undefined>>,
    setScoreCallback: React.Dispatch<React.SetStateAction<number|undefined>>,
    playfieldWidth?: number,
    playfieldHeight?: number
    ) {
    this.playfield = new Grid({width: playfieldWidth, height: playfieldHeight});
    this.score = 0;
    this.rowsCleared = 0;
    this.nextBlocks = new Array(3).fill(this.getRandomBlock());
    this.setPlayfieldCallback = setPlayfieldCallback;
    this.setScoreCallback = setScoreCallback;
  }

  get speed() : number {
    const maxSpeed = 1000; // ms
    const minSpeed = 50;   // ms
    // Decreases 50 ms each level
    return Math.max(minSpeed, maxSpeed - (this.level-1 * minSpeed));
  }

  get level() : number {
    return Math.floor(this.rowsCleared / 10) + 1;
  }
  
  /**
   * Clear all completely filled rows, one at a time, and updates score and speed accordingly.
   */
  private clearRows() : void {
    let rowsCleared = 0;
    for(let y = this.playfield.height - 1; y >= 0; y--){
      let repeat = false;
      do {
        let emptyCount = 0;
        for(let x = 0; x < this.playfield.width; x++){
          if(this.playfield.getXY({y, x}) === ' ') emptyCount++;
        }
        if(emptyCount === 0){
          // Move each row one row below
          for(let y2 = y; y2 >= 1; y2--){
            this.playfield.setValues(
              new Grid({values: [this.playfield.getRow(y2-1)]}),
              {y: y2, x: 0}
            );
          }
          // Clear first row
          this.playfield.setValues(
            new Grid({width: this.playfield.width, height: 1}),
            {y: 0, x: 0}
          );
          rowsCleared++;
          // If rows were moved, current position is now a different row
          // running again for current position before proceeding to next
          repeat = true;
        }
        else {
          repeat = false;
        }
      } while(repeat);
    }
    if(rowsCleared > 0){
      // Score increase is bigger for multiple rows and on higher levels
      this.score += 40 * rowsCleared * this.level;
      this.rowsCleared += rowsCleared;
      this.updateScoreState();
    }
  }

  private placeBlock(block: Block) : void {
    this.playfield.setValues(block.grid, block.position);
  }

  private getRandomBlock() : Block {
    const blocks = [
      new Square(this.playfield),
      new T(this.playfield),
    ];

    const min = 0;
    const max = blocks.length;
    const randomIndex = Math.floor(Math.random() * (max - min) + min);
    return blocks[randomIndex];
  }

  private tryBlockAction(
    block: Block,
    type: BlockActionType,
    direction?: MovementDirection | RotationDirection
  ) : boolean {
    let moveSuccessful: boolean = false;

    if(type === 'rotation' && direction && direction !== 'down'){
      moveSuccessful = block.tryRotate(direction);
    }
    else if(type === 'movement' && direction) {
      moveSuccessful = block.tryMove(direction);
    }
    if(moveSuccessful) this.updatePlayfieldState();
    return moveSuccessful;
  }

  private updatePlayfieldState() : void {
    this.setPlayfieldCallback(() => structuredClone(this.playfield.values));
  }

  private updateScoreState() : void {
    this.setScoreCallback(this.score);
  }

  async play() : Promise<void> {
    this.updatePlayfieldState();
    await sleep(200);
    while(this.nextBlocks[0].canPlace()){
      const block: Block = this.nextBlocks.shift()!;
      this.nextBlocks.push(this.getRandomBlock());
      this.placeBlock(block);
      
      let skip: boolean = false;
      let canMoveDown: boolean = true;
      while(canMoveDown){
        this.updatePlayfieldState();
        if(!skip){
          const startTime: number = Date.now();
          let endTime: number = startTime;
          while(endTime - startTime < this.speed){
            try{
              const key = (await waitKeyPress(this.speed)).key!;
              if(['ArrowDown','s','S','Enter'].includes(key)){
                skip = true;
                break;
              }
              else if(['ArrowLeft','a','A'].includes(key)){
                this.tryBlockAction(block,'movement','left');
              }
              else if(['ArrowRight','d','D'].includes(key)){
                this.tryBlockAction(block,'movement','right');
              }
              else if(['q','Q','LeftShift'].includes(key)){
                this.tryBlockAction(block,'rotation','left');
              }
              else if(['e','E',' '].includes(key)){
                this.tryBlockAction(block,'rotation','right');
              }
            }
            catch (_){}; // Input reading timeout
            endTime = Date.now();
          }
        }
        else {
          await sleep(12);
        }
        canMoveDown = this.tryBlockAction(block,'movement','down');
      }
      this.clearRows();
    }
    // Game Over
  }
}