import { PlayfieldYX, YX } from "@/model/types";
import { emptyPlayfield, playfieldWidth, playfieldHeight, readKey, sleep } from "./constants";
import { BlockLayout, Orientation } from "@/model/types";

abstract class Block {
  layout: BlockLayout;
  orientation: Orientation = 'up';
  anchorPosition: YX = [-3, Math.floor(playfieldWidth / 2) - 1];

  constructor(layout: BlockLayout){
    this.layout = layout;
  }

  get y(){
    return this.anchorPosition[0];
  }
  get x(){
    return this.anchorPosition[1];
  }

  moveDown(){
    this.anchorPosition = [this.y + 1, this.x];
  }
  moveLeft(){
    this.anchorPosition = [this.y, this.x - 1];
  }
  moveRight(){
    this.anchorPosition = [this.y, this.x + 1];
  }

  abstract canPlace(playfield: string[][]): boolean;
  abstract canMoveDown(playfield: string[][]): boolean;
  abstract canMoveLeft(playfield: string[][]): boolean;
  abstract canMoveRight(playfield: string[][]): boolean;
  abstract canRotateLeft(playfield: string[][]): boolean;
  abstract canRotateRight(playfield: string[][]): boolean;
  abstract rotateLeft(): void;
  abstract rotateRight(): void;
}

class Square extends Block {
  constructor(){
    const layout: BlockLayout = [
      [' ',' ',' ',' '],
      [' ',' ',' ',' '],
      [' ','#','#',' '],
      [' ','#','#',' ']
    ];
    super(layout);
  }

  canPlace(playfield: string[][]) : boolean {
    return playfield[this.y+3][this.x+1] === ' ' &&
    playfield[this.y+3][this.x+1] === ' ';
  }

  canMoveDown(playfield: string[][]) : boolean {
    const isNextRowClear = (playfield: string[][]) => {
      if(this.y+4 > playfieldHeight - 1){
        return false;
      }
      return playfield[this.y+4][this.x+1] === ' ' &&
        playfield[this.y+4][this.x+1] === ' ';
    };

    const isNextRowInsideLimits = this.y + 1 < playfieldHeight - 3;

    if(isNextRowClear(playfield) && isNextRowInsideLimits){
      return true;
    }
    return false;
  }
  canMoveLeft(playfield: string[][]) : boolean {
    return true;
  }
  canMoveRight(playfield: string[][]) : boolean {
    return true;
  }
  canRotateLeft(playfield: string[][]) : boolean {
    return false;
  }
  canRotateRight(playfield: string[][]) : boolean {
    return false;
  }
  rotateLeft() : void {
  }
  rotateRight() : void {
  }
}

export class Game {
  playfield: PlayfieldYX;
  score: number;
  speed: number;
  nextBlocks: [Block, Block, Block] | [Block, Block];
  currentBlock: Block;
  setPlayfieldCallback: React.Dispatch<React.SetStateAction<PlayfieldYX|undefined>>;
  setScoreCallback: React.Dispatch<React.SetStateAction<number|undefined>>;

  constructor(
    setPlayfieldCallback: React.Dispatch<React.SetStateAction<PlayfieldYX|undefined>>,
    setScoreCallback: React.Dispatch<React.SetStateAction<number|undefined>>
    ) {
    this.playfield = emptyPlayfield;
    this.score = 0;
    this.speed = 1000;
    this.currentBlock = new Square;
    this.nextBlocks = [new Square, new Square, new Square];
    this.setPlayfieldCallback = setPlayfieldCallback;
    this.setScoreCallback = setScoreCallback;
  }

  addCurrentBlock(){
    const anchorY = this.currentBlock.y;
    const anchorX = this.currentBlock.x;

    const yStart = anchorY > 0 ? 0 : 0 - anchorY;

    for(let y = yStart; y < 4; y++){
      for(let x = 0; x < 4; x++){
        this.playfield[anchorY+y][anchorX+x] = this.currentBlock.layout[y][x];
      }
    }
  }
  removeCurrentBlock(){
    const anchorY = this.currentBlock.y;
    const anchorX = this.currentBlock.x;

    const yStart = anchorY > 0 ? 0 : 0 - anchorY;

    for(let y = yStart; y < 4; y++){
      for(let x = 0; x < 4; x++){
        this.playfield[anchorY+y][anchorX+x] = ' ';
      }
    }
  }

  updatePlayfieldState() : void {
    this.setPlayfieldCallback(() => structuredClone(this.playfield));
  }

  updateScoreState() : void {
    this.setScoreCallback(this.score);
  }

  getPlayerInput() : void {
    const startDate = new Date().getTime();
    let newDate = new Date().getTime();

    let stopped = false;
    while(!stopped){
      newDate = new Date().getTime();
      const diff = newDate - startDate;
      console.log(diff > 500);
      if(diff > 500){
        stopped = true;
      }
    }
  }

  async startGame() : Promise<void> {
    while(this.currentBlock.canPlace(this.playfield)){
      this.addCurrentBlock();
      this.updatePlayfieldState();
      while(this.currentBlock.canMoveDown(this.playfield)){
        //await this.getPlayerInput();
        //await new Promise(() => this.getPlayerInput());
        //await sleep(500);
        const keyEvent = await readKey();
        console.log('Pressed', keyEvent.key);
        this.updatePlayfieldState();
        this.removeCurrentBlock();
        this.currentBlock.moveDown();
        this.addCurrentBlock();
        this.updatePlayfieldState();
      }
      this.currentBlock = this.nextBlocks.shift()!;
      this.nextBlocks.push(new Square);
    }
  }
}