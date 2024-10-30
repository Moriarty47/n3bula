export type SingletonPromise<T> = {
  (): Promise<T>;
  reset: () => Promise<void>;
};

export function singletonPromise<T>(fn: () => Promise<T>): SingletonPromise<T> {
  let promise: Promise<T> | undefined;

  function wrapper() {
    if (!promise) promise = fn();
    return promise;
  }

  wrapper.reset = async () => {
    const prev = promise;
    promise = undefined;
    if (prev) await prev;
  };

  return wrapper;
};

export function withTimeout<Fn extends (...args: any[]) => any>(cb: Fn, interval: number) {
  let isPending = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function stop() {
    isPending = false;
    clear();
  }

  function start(...args: Parameters<Fn> | []) {
    clear();
    isPending = true;
    timer = setTimeout(() => {
      isPending = false;
      timer = null;

      cb(...args);
    }, interval);
  }

  return {
    start,
    stop,
    isPending,
  };
}