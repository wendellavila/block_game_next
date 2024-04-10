import { ReactNode } from "react";
import { pixelify } from "../utils/constants";

import GameArea from "@/app/client";

function Header() : ReactNode {
  const title: string = 'Block Game';
  const colors: string[] = [
    'text-red-500', 'text-orange-500','text-yellow-500',
    'text-green-500', 'text-blue-500', 'text-purple-500'
  ];

  /**
   * Helps turn a list into a circular list by returning a valid index for any provided n
   * @param n - A positive integer.
   * @param length - The length of a list
   * @returns - An integer bigger or equal to 0 and smaller than length.
   */
  const getCircularListIndex = (n: number, length: number) : number => {
    return n - (Math.floor(n / length) * length);
  }

  return (
    <header>
      <h1 className={`text-center text-[50px] ${pixelify.className}`}>
        {
          title.split(' ').map(
            (word, wordIndex) => word.split('').map(
              (letter, letterIndex) =>
              <span
                key={`${word}${letterIndex}`}
                className={colors[getCircularListIndex(letterIndex, colors.length)]}
              >
                { wordIndex > 0 && letterIndex === 0 ? <> </> : <></> /* Renders spaces between words */}
                {letter}
              </span>
            )
          )
        }
      </h1>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <Header/>
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        <GameArea/>
      </main>
    </>
  );
}
