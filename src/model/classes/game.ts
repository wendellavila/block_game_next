import Grid from "@/model/classes/grid";
import Block, { L_Block,L2_Block,I_Block,S_Block,Square_Block,T_Block,Z_Block } from "@/model/classes/block";
import { BlockActionType,MovementDirection,RotationDirection } from "@/model/types";
import { sleep, readKey } from "@/model/functions";

export default class Game {
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
      new L_Block(this.playfield),
      new L2_Block(this.playfield),
      new I_Block(this.playfield),
      new S_Block(this.playfield),
      new Square_Block(this.playfield),
      new T_Block(this.playfield),
      new Z_Block(this.playfield),
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
              const key = (await readKey(this.speed)).key!;
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