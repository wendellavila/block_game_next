import Block,
  { L_Block,L2_Block,I_Block,S_Block,Square_Block,T_Block,Z_Block }
from '@/classes/block';
import Grid from '@/classes/grid';
import { BlockActionType,MovementDirection,RotationDirection,SetState } from '@/typing/types';
import { sleep, readKey } from '@/utils/functions';

export default class Game {
  private playfield: Grid;
  private score: number;
  private rowsCleared: number;
  private onHoldBlock: Block | undefined;
  private nextBlocks: Block[];
  private setPlayfieldCallback: SetState<string[][]|undefined>;
  private setLevelCallback: SetState<number>;
  private setScoreCallback: SetState<number>;
  private setNextBlocksCallback: SetState<string[][][]>;
  private setHoldBlockCallback: SetState<string[][]|undefined>;

  constructor(
    args: {
      setPlayfieldCallback: SetState<string[][]|undefined>,
      setLevelCallback: SetState<number>,
      setScoreCallback: SetState<number>,
      setNextBlocksCallback: SetState<string[][][]>,
      setHoldBlockCallback: SetState<string[][]|undefined>,
      playfieldWidth?: number,
      playfieldHeight?: number
    }
    ) {
    this.playfield = new Grid({width: args.playfieldWidth, height: args.playfieldHeight});
    this.score = 0;
    this.rowsCleared = 0;
    this.nextBlocks = [
      this.getRandomBlock(),
      this.getRandomBlock(),
      this.getRandomBlock()
    ];
    this.setPlayfieldCallback = args.setPlayfieldCallback;
    this.setLevelCallback = args.setLevelCallback;
    this.setScoreCallback = args.setScoreCallback;
    this.setNextBlocksCallback = args.setNextBlocksCallback;
    this.setHoldBlockCallback = args.setHoldBlockCallback;
  }

  get levelSpeedTimeout() : number {
    const maxTimeout = 1000; // ms
    const minTimeout = 50;   // ms
    // Decreases 50 ms each level
    return Math.max(minTimeout, maxTimeout - (this.level-1 * minTimeout));
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
          // Copy each row to row below
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
      this.updateLevelState();
    }
  }

  private placeBlock(block: Block) : void {
    this.playfield.setValues(block.grid, block.position);
  }

  private getRandomBlock() : Block {
    const min: number = 0;
    const max: number = 7;
    const randomIndex: number = Math.floor(Math.random() * (max - min) + min);

    switch(randomIndex){
      case 0:
        return new L_Block(this.playfield);
      case 1:
        return new L2_Block(this.playfield);
      case 3:
        return new I_Block(this.playfield);
      case 4:
        return new S_Block(this.playfield);
      case 5:
        return new Square_Block(this.playfield);
      case 6:
        return new T_Block(this.playfield);
      default: 
        return new Z_Block(this.playfield);
    }
  }

  private tryBlockAction(
    block: Block,
    type: BlockActionType,
    direction: MovementDirection | RotationDirection
  ) : boolean {
    let moveSuccessful: boolean = false;

    if(type === 'rotation'&& direction !== 'down'){
      moveSuccessful = block.tryRotate(direction);
    }
    else if(type === 'movement') {
      moveSuccessful = block.tryMove(direction);
    }
    if(moveSuccessful) this.updatePlayfieldState();
    return moveSuccessful;
  }

  private holdBlock(
    block: Block
  ) : Block | undefined {
    let onPlayBlock: Block | undefined = undefined;

    //Remove current block from playfield
    this.playfield.setValues(
      new Grid({width: block.width, height: block.height}),
      block.position
    );
    
    if(this.onHoldBlock){
      onPlayBlock = this.onHoldBlock;
      onPlayBlock.resetPosition(this.playfield);
      this.onHoldBlock = block;
    }
    else {
      this.onHoldBlock = block;
    }
    this.updateHoldBlockState();
    return onPlayBlock;
  }

  private getNextBlock() : Block {
    const block: Block = this.nextBlocks.shift()!;
    this.nextBlocks.push(this.getRandomBlock());
    this.placeBlock(block);
    this.updateNextBlocks();
    return block;
  }

  private updatePlayfieldState() : void {
    this.setPlayfieldCallback(structuredClone(this.playfield.values));
  }

  private updateNextBlocks() : void {
    this.setNextBlocksCallback(this.nextBlocks.map(block => structuredClone(block.grid.values)));
  }

  private updateScoreState() : void {
    this.setScoreCallback(this.score);
  }

  private updateLevelState() : void {
    this.setLevelCallback(this.level);
  }

  private updateHoldBlockState () : void {
    this.setHoldBlockCallback(this.onHoldBlock ? this.onHoldBlock.grid.values : undefined);
  }
  /**
   * @returns {number} Final score
   */
  async play() : Promise<number> {
    this.updatePlayfieldState();
    await sleep(200);
    while(this.nextBlocks[0].canPlace()){
      let block: Block = this.getNextBlock();
      let skip: boolean = false;
      let canMoveDown: boolean = true;
      let blockStored: boolean = false;
      while(canMoveDown && !blockStored){
        this.updatePlayfieldState();
        if(!skip){
          const startTime: number = Date.now();
          let endTime: number = startTime;
          while(endTime - startTime < this.levelSpeedTimeout){
            try{
              const key = (await readKey(this.levelSpeedTimeout)).key!;
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
              else if(['h', 'H'].includes(key)){
                const returnedBlock = this.holdBlock(block);
                if(returnedBlock){
                  block = returnedBlock;
                }
                else {
                  blockStored = true;
                }
                break;
              }
            }
            catch (_){}; // Input read timeout
            endTime = Date.now();
          }
        }
        else {
          await sleep(12);
        }
        if(!blockStored){
          canMoveDown = this.tryBlockAction(block,'movement','down');
        }
        
      }
      this.clearRows();
    }
    // Game Over
    return this.score;
  }
}