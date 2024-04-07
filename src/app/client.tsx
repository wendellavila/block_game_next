'use client';
import { ReactNode, useEffect, useState } from "react";
import { PlayfieldYX } from "@/model/types";
import { Game } from "@/model/classes";

function PlayfieldGrid(props: { playfield?: string[][] }): ReactNode {
  return (
    props.playfield &&
    <div id="playfield">
      {
        props.playfield.map((row, rowIndex) =>
          <div
            key={rowIndex}
            id={`playfield-row-${rowIndex+1}`}
            className="flex flex-row"
          >
            { row.map((cell, cellIndex) =>
              <div
                key={`${rowIndex}${cellIndex}`}
                id={`playfield-row-${rowIndex+1}-cell-${cellIndex+1}`}
                className={`h-10 w-10 border-[1px] border-neutral-900
                ${cell === ' ' ? 'bg-neutral-800' : 'bg-red-500'}`}
              ></div>
            )}
          </div>
        )
      }
    </div>
  );
}

export default function GameArea(): ReactNode {
  const [playfield, setPlayfield] = useState<string[][] | undefined>(undefined);
  const [score, setScore] = useState<number | undefined>(undefined);
  const game = new Game(setPlayfield, setScore);

  useEffect(()=>{
    const startGame = async() => {
      await game.play();
    };
    startGame();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <>
      <PlayfieldGrid playfield={playfield}/>
    </>
  );
}