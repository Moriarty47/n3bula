export type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

export const useDefer = <T>() => {
  const deferred = {} as Deferred<T>;
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

/**
 * @param delay default 1000ms
 */
export const sleep = (delay = 1000) =>
  new Promise<void>(resolve => setTimeout(resolve, delay));
