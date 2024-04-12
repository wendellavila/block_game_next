'use client';

export default function PlayButton(props: {onClick?: () => void}) {
  return (
    <button
      className="px-4 py-1 bg-transparent border-2 border-solid animate-pulse
      border-red-500 text-white"
      onClick={props.onClick}
    >▶ Play</button>
  );
}