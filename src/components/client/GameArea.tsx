'use client';
import { useState } from 'react';
import Game from '@/classes/game';
import { GameStatus } from '@/typing/types';
import { HoldBlock,NextBlocks,PlayButton,PlayfieldGrid,Scoreboard } from '@/components/client';

export default function GameArea() {
  const [ gameStatus, setGameStatus ] = useState<GameStatus>("not started");

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

  return (
    <main className="flex flex-col items-center justify-between p-8 grow">
      { gameStatus === 'not started' &&
        <section id="game-start" className="flex flex-col items-center justify-center grow">
          <PlayButton onClick={
            async () => {
              setGameStatus('playing');
              await game.play();
              setGameStatus('over');
            }
          }/>
        </section>
      }
      { gameStatus === 'over' &&
        <section id="game-over" className="flex flex-col items-center justify-center grow">
          <span className="text-lg mb-1">Game Over</span>
          <span className="text-md mb-4">Score: {score}</span>
          <span className="mb-1">Play again?</span>
          <PlayButton onClick={
            async () => {
              clearStates();
              setGameStatus('playing');
              await game.play();
              setGameStatus('over');
            }
          }/>
        </section>
      }
      { gameStatus === 'playing' &&
        <section id="game" className="flex flex-row gap-4 grow">
          <HoldBlock block={holdBlock}/>
          <PlayfieldGrid playfield={playfield}/>
          <div className="flex flex-col items-center gap-4">
            <NextBlocks blocks={nextBlocks}/>
            <Scoreboard id="level" title="Level" value={level}/>
            <Scoreboard id="score" title="Score" value={score}/>
          </div>
        </section>
      }
    </main>
  );
}