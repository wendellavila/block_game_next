'use server';
import { pixelify } from '@/utils/constants';
import { headerColors } from '@/utils/constants';
import { getCircularListIndex } from '@/utils/functions';

export default async function TitleHeader(props: {title?: string}) {
  return (
    <header>
      <h1
        id="title"
        className={`text-center text-[3rem] ${pixelify.className}
        animate-ping animate-once animate-ease-in animate-reverse animate-duration-700`}
      >
        { props.title && props.title.split('').map((letter, letterIndex) =>
          <span
            id={`title-letter-${letterIndex+1}`}
            key={`title-letter-${letterIndex+1}`}
            className={`${headerColors[
              getCircularListIndex(letterIndex, headerColors.length)
            ]}`}
          >{letter}</span>
        )}
      </h1>
    </header>
  );
}