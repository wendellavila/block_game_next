import { PlayfieldYX } from "@/model/types";

export const playfieldWidth: number = 10;
export const playfieldHeight: number = 20;
export const layoutSize: number = 4;

export const emptyPlayfield = Array.from(
  Array<number>(playfieldHeight),
  (_) => Array.from(
    Array<number>(playfieldWidth), (_) => ' '
  )
) as PlayfieldYX;

export const sleep = (ms: number) => new Promise<void>(
  (r) => setTimeout(r, ms)
);
export const readKey = () => new Promise<KeyboardEventInit>(
  (r) => window.addEventListener('keydown', r, {once: true})
);

export const waitKeyPress = (timeout : number) => new Promise<KeyboardEventInit>((resolve, reject) => {
  // start timeout
  const timeoutID = setTimeout(
    () => reject('longCalculation took too long'),
    timeout
  );
  
  // start calculation
  readKey().then(result => {
    clearTimeout(timeoutID);
    resolve(result);
  });
})