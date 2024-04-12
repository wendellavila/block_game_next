'use client';
import { SectionLabel } from '@/components/client';

export default function Scoreboard(props: {id?: string, title: string, value: number}) {
  return (
    <section
      id={props.id}
      className="flex flex-col items-center animate-fade-down
      animate-ease-out animate-duration-700"
    >
      <SectionLabel>{props.title}</SectionLabel>
      <span className="text-lg leading-tight mt-1">
        {props.value}
      </span>
    </section>
  );
}