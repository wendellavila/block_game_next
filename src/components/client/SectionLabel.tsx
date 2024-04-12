'use client';

export default function SectionLabel(props: {children?: React.ReactNode}) {
  return (
    <span className="px-2 py-0 bg-neutral-800 text-white">
      {props.children}
    </span>
  );
}