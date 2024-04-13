/**
 * Turns a list into a circular list by returning a valid index for any provided n
 * @param n - A positive integer.
 * @param length - The length of a list
 * @returns - An integer bigger or equal to 0 and smaller than length.
 */
export function getCircularListIndex(n: number, length: number) : number {
  return n - (Math.floor(n / length) * length);
}

export function getBlockBackground(char: string){
  switch(char){
    case '#': // Square_Block
      return 'bg-yellow-500';
    case 'Z': // Z_Block
      return 'bg-red-500';
    case 'S': // S_Block
      return 'bg-green-500';
    case 'I': // I_Block
      return 'bg-cyan-500';
    case 'L': // L_Block
      return 'bg-orange-500';
    case 'l': // BackwardL_Block
      return 'bg-blue-500';
    case 'T': // T_Block
      return 'bg-purple-500';
    default: // Empty cell
      return 'bg-neutral-800';
  }
}

export async function sleep(ms: number) : Promise<void>{
  return new Promise((r) => setTimeout(r, ms));
}

export async function readKey(timeout?: number) : Promise<KeyboardEventInit>{
  return new Promise((resolve, reject) => {

    let timeoutRef: ReturnType<typeof setTimeout> | undefined = undefined;

    if(timeout){
      timeoutRef = setTimeout(
        () => reject(`No keys pressed in ${timeout} ms.`),
        timeout
      );
    }

    new Promise<KeyboardEventInit>((r) => window.addEventListener('keydown', r, {once: true})).then(
      result => {
        if(timeoutRef) clearTimeout(timeoutRef);
        resolve(result);
      }
    );
  });
};