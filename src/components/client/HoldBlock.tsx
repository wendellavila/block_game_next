'use client';
import { getBlockBackground } from '@/utils/functions';
import { SectionLabel } from '@/components/client';

export default function HoldBlock(props: {block?: string [][]}) {

  return (
    <section
      className="flex flex-col items-center animate-fade-down animate-ease-out animate-duration-700"
    >
      <SectionLabel>Hold</SectionLabel>
      <div
        id={`hold-block-layout`}
        className={`flex flex-col items-center justify-center p-2 mt-2
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