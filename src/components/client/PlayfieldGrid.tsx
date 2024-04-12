'use client';
import { getBlockBackground } from '@/utils/functions';

export default function PlayfieldGrid(props: {playfield?: string[][]}) {
  return (
    props.playfield &&
    <section
      id="playfield"
      className="animate-fade-down animate-ease-out animate-duration-500"
    >
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