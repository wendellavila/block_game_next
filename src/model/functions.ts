export async function sleep(ms: number) : Promise<void>{
  return new Promise((r) => setTimeout(r, ms));
}

export async function readKey(timeout?: number) : Promise<KeyboardEventInit>{
  return new Promise((resolve, reject) => {

    let timeoutRef: ReturnType<typeof setTimeout> | undefined = undefined;

    if(timeout){
      timeoutRef = setTimeout(
        () => reject('longCalculation took too long'),
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