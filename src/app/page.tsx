import { ReactNode } from 'react';
import { pixelify } from '@/utils/constants';

import GameArea from '@/app/client';
import { textColorClasses } from '@/utils/constants';
import { getCircularListIndex } from '@/utils/functions';

function Header() : ReactNode {
  const title: string = 'Block Game';

  return (
    <header>
      <h1 id="title" className={`text-center text-[3rem] ${pixelify.className}`}>
        { title.split('').map((letter, letterIndex) =>
          <span
            id={`title-letter-${letterIndex+1}`}
            key={`title-letter-${letterIndex+1}`}
            className={`${textColorClasses[
              getCircularListIndex(letterIndex, textColorClasses.length)
            ]}`}
          >
            {letter}
          </span>
        )}
      </h1>
    </header>
  );
}

export default function Home() {
  return (
    <>
      {/* <Header/> */}
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        <GameArea/>
      </main>
    </>
  );
}
