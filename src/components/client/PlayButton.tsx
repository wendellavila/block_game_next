'use client';

export default function PlayButton(props: {onClick?: () => void, className?: string}) {
  return (
    <button
      className={`
      px-4 py-1 bg-transparent border-2 border-solid animate-pulse
      border-red-500 text-white ${props.className}`}
      aria-label="Play Game"
      onClick={props.onClick}
    >▶ Play</button>
  );
}