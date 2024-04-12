'use client';
import { ReactNode, useEffect, useState } from 'react';
import Game from '@/classes/game';
import { getBlockBackground,getFirstNonEmptyChar } from '@/utils/functions';

import { silkscreen } from '@/utils/constants';

function PlayfieldGrid(props: { playfield?: string[][] }): ReactNode {
  return (
    props.playfield &&
    <section id="playfield">
      { props.playfield.map((row, rowIndex) =>
        <div
          key={`playfield-row-${rowIndex+1}`}
          id={`playfield-row-${rowIndex+1}`}
          className="flex flex-row"
        >
          { row.map((cell, cellIndex) =>
            <div
              key={`playfield-row-${rowIndex+1}-cell-${cellIndex+1}`}
              id={`playfield-row-${rowIndex+1}-cell-${cellIndex+1}`}
              className={`h-6 w-6 border-[1px] border-neutral-900
              ${getBlockBackground(cell)}`}
            ></div>
          )}
        </div>
      )}
    </section>
  );
}

function SectionLabel(props: {children?: ReactNode, className?: string}) : ReactNode {
  return (
    <span className={`px-2 py-0 text-sha text-white bg-neutral-800`}>
      {props.children}
    </span>
  );
}

function NextBlocks(props: {blocks : string[][][]}) : ReactNode {
  
  return (
    <section id="next-blocks" className="flex flex-col items-center">
      <SectionLabel>
        Next
      </SectionLabel>
      { props.blocks.map((block, blockIndex) => 
        <div id={`next-block-${blockIndex+1}`} key={blockIndex} className="mt-4">
          { block.map((row, rowIndex) => 
            <div
              key={`next-block-${blockIndex+1}-row-${rowIndex+1}`}
              id={`next-block-${blockIndex+1}-row-${rowIndex+1}`}
              className="flex flex-row"
            >
              { row.map((cell, cellIndex) =>
                <div
                  key={`next-block-${blockIndex+1}-row-${rowIndex+1}-cell-${cellIndex+1}`}
                  id={`next-block-${blockIndex+1}-row-${rowIndex+1}-cell-${cellIndex+1}`}
                  className={
                    `h-4 w-4 border-[1px]
                    ${cell !== ' ' ? 'border-neutral-900' : 'border-transparent'}
                    ${cell !== ' ' ? getBlockBackground(cell) : 'bg-transparent'}`
                  }
                ></div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function HoldBlock(props: {block?: string [][]}): ReactNode {
  let headerBgColor = 'bg-neutral-800';
  if(props.block) headerBgColor = getBlockBackground(getFirstNonEmptyChar(props.block));

  return (
    <section className="flex flex-col items-center">
      <SectionLabel className={`mb-4 ${headerBgColor}`}>
        Hold
      </SectionLabel>
      <div
        id={`hold-block-layout`}
        className={`flex flex-col items-center justify-center p-2
        border-neutral-800 border-2 border-solid ${props.block ? '' : 'w-[70px] h-[70px]'}`}
      >
        { props.block && props.block.map((row, rowIndex) => 
        <div
          key={`hold-block-row-${rowIndex+1}`}
          id={`hold-block-row-${rowIndex+1}`}
          className="flex flex-row"
        >
          { row.map((cell, cellIndex) =>
            <div
              key={`hold-block-row-${rowIndex+1}-cell-${cellIndex+1}`}
              id={`hold-block-row-${rowIndex+1}-cell-${cellIndex+1}`}
              className={
                `h-4 w-4 border-[1px]
                ${cell !== ' ' ? 'border-neutral-900' : 'border-transparent'}
                ${cell !== ' ' ? getBlockBackground(cell) : 'bg-transparent'}`
              }
            ></div>
          )}
        </div>
        )}
      </div>
    </section>
  );
}

function Scoreboard(props: {id?: string, title: string, value: number}) : ReactNode {
  return (
    <section id={props.id} className="flex flex-col items-center">
      <SectionLabel>
        {props.title}
      </SectionLabel>
      <span className="text-lg leading-tight mt-1">
        {props.value}
      </span>
    </section>
  );
}

export default function GameArea(): ReactNode {
  const [ playfield, setPlayfield ] = useState<string[][] | undefined>(undefined);
  const [ score, setScore ] = useState<number>(0);
  const [ level, setLevel ] = useState<number>(1);
  const [ holdBlock, setHoldBlock ] = useState<string[][]|undefined>(undefined);
  const [ nextBlocks, setNextBlocks ] = useState<string[][][]>([]);
  const [ game, setGame ] = useState<Game>(
    new Game({
      setPlayfieldCallback: setPlayfield,
      setLevelCallback: setLevel,
      setScoreCallback: setScore,
      setNextBlocksCallback: setNextBlocks,
      setHoldBlockCallback: setHoldBlock
    })
  );

  const clearStates = () => {
    setPlayfield(undefined);
    setScore(0);
    setLevel(1);
    setHoldBlock(undefined);
    setNextBlocks([]);
    setGame(
      new Game({
        setPlayfieldCallback: setPlayfield,
        setLevelCallback: setLevel,
        setScoreCallback: setScore,
        setNextBlocksCallback: setNextBlocks,
        setHoldBlockCallback: setHoldBlock
      })
    );
  };

  useEffect(()=>{
    (async() => await game.play())();
  }, []);

  return (
    <div className={`flex flex-row gap-4 ${silkscreen.className}`}>
      <HoldBlock block={holdBlock}/>
      <PlayfieldGrid playfield={playfield}/>
      <div className="flex flex-col items-center gap-4">
        <NextBlocks blocks={nextBlocks}/>
        <Scoreboard id="level" title="Level" value={level}/>
        <Scoreboard id="score" title="Score" value={score}/>
      </div>
    </div>
  );
}