'use server';
import { pixelify } from '@/utils/constants';
import { textColorClasses } from '@/utils/constants';
import { getCircularListIndex } from '@/utils/functions';

export default async function TitleHeader(props: {title?: string}) {
  return (
    <header>
      <h1 id="title" className={`text-center text-[3rem] ${pixelify.className}`}>
        { props.title && props.title.split('').map((letter, letterIndex) =>
          <span
            id={`title-letter-${letterIndex+1}`}
            key={`title-letter-${letterIndex+1}`}
            className={`${textColorClasses[
              getCircularListIndex(letterIndex, textColorClasses.length)
            ]}`}
          >{letter}</span>
        )}
      </h1>
    </header>
  );
}