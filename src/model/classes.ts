import { PlayfieldYX, YX } from "@/model/types";
import { emptyPlayfield, playfieldWidth, playfieldHeight, waitKeyPress,layoutSize } from "./constants";
import { BlockLayout, Orientation,MovementDirection,RotationDirection } from "@/model/types";

abstract class Block {
  layout: BlockLayout;
  orientation: Orientation = 'up';
  anchorPosition: YX = [
    -layoutSize+1,
    Math.floor(playfieldWidth / 2) - 2
  ]; // relative to playfield width and layout height
  constructor(layout: BlockLayout){
    this.layout = layout;
  }

  get y(){
    return this.anchorPosition[0];
  }
  get x(){
    return this.anchorPosition[1];
  }

  move(direction: MovementDirection){
    if(direction === 'left'){
      this.anchorPosition = [this.y, this.x - 1];
    }
    else if(direction === 'right'){
      this.anchorPosition = [this.y, this.x + 1]
    }
    else {
      this.anchorPosition = [this.y + 1, this.x]
    }
  }

  canPlace(playfield: string[][]) : boolean {
    //Start position of last row of layout
    const layoutY = layoutSize-1;
    const layoutX = 0;
    //Start position of first row of playfield
    const playfieldY = 0;
    const playfieldX = Math.floor(playfieldWidth / 2) - 2;

    for(let i = 0; i < layoutSize; i++){
      const isLayoutPixelNotEmpty = this.layout[layoutY][layoutX+i] !== ' ';
      const isPlayfieldPixelNotEmpty = playfield[playfieldY][playfieldX+i] !== ' ';
      if(isLayoutPixelNotEmpty && isPlayfieldPixelNotEmpty){
        return false;
      }
    }
    return true;
  }
  abstract canMove(playfield: string[][], direction: MovementDirection): boolean;
  abstract canRotate(playfield: string[][], direction: RotationDirection): boolean;
  abstract rotate(direction: RotationDirection): void;
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

  canMove(playfield: string[][], direction: MovementDirection) : boolean {
    if(direction === 'down'){
      const hasNextRow = this.y + 1 < playfieldHeight - 3;
      const isNextRowClear = (playfield: string[][]) => {
        if(this.y+4 > playfieldHeight - 1){
          return false;
        }
        return playfield[this.y+4][this.x+1] === ' ' &&
          playfield[this.y+4][this.x+1] === ' ';
      };
      if(hasNextRow && isNextRowClear(playfield)){
        return true;
      }
    }
    return false;
  }
  canRotate(playfield: string[][], direction: RotationDirection) : boolean {
    return false;
  }
  rotate(direction: RotationDirection) : void {
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
      while(this.currentBlock.canMove(this.playfield, 'down')){
        try{
          const keyEvent = await waitKeyPress(this.speed);
          console.log('Pressed', keyEvent.key);
        }
        catch (error) {
          console.log(`No key pressed in ${this.speed} ms.`);
        }
        this.updatePlayfieldState();
        this.removeCurrentBlock();
        this.currentBlock.move('down');
        this.addCurrentBlock();
        this.updatePlayfieldState();
      }
      this.currentBlock = this.nextBlocks.shift()!;
      this.nextBlocks.push(new Square);
    }
  }
}