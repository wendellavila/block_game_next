'use client';
import { getBlockBackground } from '@/utils/functions';
import { SectionLabel } from '@/components/client';

export default function NextBlocks(props: {blocks : string[][][]}) {
  return (
    <section
      id="next-blocks"
      className="flex flex-col items-center animate-fade-down animate-ease-out animate-duration-700"
    >
      <SectionLabel>Next</SectionLabel>
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