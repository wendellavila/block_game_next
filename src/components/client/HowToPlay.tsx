function Keycap(props: {children?: string}){
  return (
    <div className={`flex flex-col items-center justify-center min-h-6 min-w-6
    bg-neutral-800 text-white text-md border-solid border-neutral-700
    border-t-0 border-l-0 border-b-[3px] border-r-[3px]`
    }>
      {props.children}
    </div>
  );
}

function KeyList(props: {children?: string[], className?: string}){
  return (
    <div className={`flex flex-row gap-2 ${props.className}`}>
      { props.children &&
        props.children.map(
          keyText =>
          <Keycap key={keyText}>{keyText}</Keycap>
        )
      }
    </div>
  );
}

function InstructionRow(props: {children?: React.ReactNode, message?: string}){
  return (
    <article className="flex flex-row items-center justify-between gap-12 mb-8">
      <div className="flex flex-col">
        {props.children}
      </div>
      <span className="text-lg">
        {props.message}
      </span>
    </article>
  );
}

export default function HowToPlay(){
  return (
    <section id="how-to-play" className="border-solid border border-neutral-500 pt-2 px-6">
      <h3 className="text-xl text-center mb-4">How to Play</h3>
      <InstructionRow message="Move Block">
        <KeyList className="mb-4">{['A','S','D']}</KeyList>
        <KeyList>{['⇦','⇩','⇨']}</KeyList>
      </InstructionRow>
      <InstructionRow message="Rotate Block Left">
        <KeyList>{['Q','LShift']}</KeyList>
      </InstructionRow>
      <InstructionRow message="Rotate Block Right">
        <KeyList>{['E','Space']}</KeyList>
      </InstructionRow>
      <InstructionRow message="Hold Block">
        <KeyList>{['H']}</KeyList>
      </InstructionRow>
    </section>
  );
}