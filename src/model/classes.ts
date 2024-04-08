import { XY } from "@/model/types";
import { defaultPlayfieldSize, sleep, waitKeyPress } from "./constants";
import { DirectionGrids,Orientation,MovementDirection,RotationDirection } from "@/model/types";

abstract class Block {
  private directionGrids: DirectionGrids;
  private orientation: Orientation = 'up';
  position: XY; // relative to playfield width and layout height
  playfield: Grid;
  constructor(layouts: DirectionGrids, playfield: Grid){
    this.directionGrids = layouts;
    this.playfield = playfield;
    this.position = {
      x: Math.floor(playfield.width/2)-this.width+1,
      y: -this.height+1
    }
  }

  getXY(position: XY) : string {
    return this.grid.getXY({x: position.x, y: position.y});
  }

  get grid(){
    return this.directionGrids[this.orientation];
  }
  get height(){
    return this.grid.height;
  }
  get width(){
    return this.grid.width;
  }
  get y(){
    return this.position.y;
  }
  get x(){
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
    tempPlayfield.setValues(this.grid, tempPosition);
    this.position = tempPosition;
    this.playfield.setValues(tempPlayfield, {y: 0, x: 0});
    
    return true;
  }
  tryRotate(direction: RotationDirection): boolean {
    return false;
  };
}

class Square extends Block {
  constructor(playfield: Grid){
    const layout: Grid = new Grid({values: [
      ['#','#'],
      ['#','#']
    ]});
    const layouts = {
      up: layout,
      left: layout,
      right: layout,
      down: layout,
    }
    super(layouts, playfield);
  }
  tryRotate(direction: RotationDirection) : boolean {
    super.tryRotate(direction);
    return false;
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
  private speed: number;
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
    this.speed = 1000;
    this.nextBlocks = new Array(3).fill(new Square(this.playfield));
    this.setPlayfieldCallback = setPlayfieldCallback;
    this.setScoreCallback = setScoreCallback;
  }

  private placeBlock(block: Block){
    this.playfield.setValues(block.grid, block.position);
  }

  private tryMoveBlock(block: Block, direction: MovementDirection) : boolean {
    const moveSuccessful = block.tryMove(direction);
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
      this.nextBlocks.push(new Square(this.playfield));
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
              const key = (await waitKeyPress(this.speed)).key;
              if(key === 'ArrowDown' || key === 's' || key === 'Enter'){
                skip = true;
                break;
              }
              else if(key === 'ArrowLeft' || key ===  'a'){
                this.tryMoveBlock(block, 'left');
              }
              else if(key === 'ArrowRight' || key ===  'd'){
                this.tryMoveBlock(block, 'right');
              }
            }
            catch (_){}; // Input reading timeout
            endTime = Date.now();
          }
        }
        else {
          await sleep(12);
        }
        canMoveDown = this.tryMoveBlock(block, 'down');
      }
    }
    // Game Over
  }
}