import { TitleHeader } from '@/components/server';
import { GameArea } from '@/components/client';

export default function Home() {
  return (
    <>
      <TitleHeader title="Block Game"/>
      <GameArea/>
    </>
  );
}