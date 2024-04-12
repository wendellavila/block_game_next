'use client';
import { useState } from 'react';
import Game from '@/classes/game';
import { GameStatus } from '@/typing/types';
import { HoldBlock,NextBlocks,PlayButton,PlayfieldGrid,Scoreboard } from '@/components/client';

function GameOver(props: {score: number, onClick: () => void}){
  return (
    <section id="game-over" className="flex flex-col items-center justify-center grow">
      <span className="text-xl mb-1">Game Over</span>
      <span className="text-md mb-4">Score: {props.score}</span>
      <span className="text-sm mb-2">Play again?</span>
      <PlayButton onClick={props.onClick}/>
    </section>
  );
}

function GameNotStarted(props: {onClick: () => void}){
  return (
    <section id="game-start" className="flex flex-col items-center justify-center grow">
      <PlayButton onClick={props.onClick}/>
    </section>
  );
}

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

  const resetGameState = () => {
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

  const startGame = async(resetState?: boolean) => {
    if(resetState === true) resetGameState();
    setGameStatus('playing');
    await game.play();
    setGameStatus('over');
  }

  return (
    <main className="flex flex-col items-center justify-center p-8 grow">
      { gameStatus === 'not started' &&
        <GameNotStarted onClick={() => startGame(false)}/>
      }
      { gameStatus === 'over' &&
        <GameOver score={score} onClick={() => startGame(true)}/>
      }
      { (gameStatus === 'playing'/* || gameStatus === 'over'  Show game underneath game over screen */) &&
        <section id="game" className="flex flex-row gap-4 grow">
          <div className="flex flex-col items-center">
            <HoldBlock block={holdBlock}/>
            <button
              aria-label="Restart"
              onClick={() => startGame(true)}
            >↺</button>
          </div>
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