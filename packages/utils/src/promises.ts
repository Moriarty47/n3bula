import { isUndefined } from './is';

export type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  flush: (value?: T | PromiseLike<T>, reason?: any) => Deferred<T>;
};

export const useDefer = <T>() => {
  const deferred = {} as Deferred<T>;
  const create = () => {
    deferred.promise = new Promise<T>((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
  };

  create();

  Object.defineProperty(deferred, 'flush', {
    value: (value?: T | PromiseLike<T>, reason?: any) => {
      const hasValue = !isUndefined(value);
      const hasReason = !isUndefined(reason);
      if (hasValue && !hasReason) {
        deferred.resolve(value);
      } else if (!hasValue && hasReason) {
        deferred.reject(reason);
      } else {
        deferred.reject(new Error('flushed'));
      }
      create();
      return deferred;
    },
  });

  return deferred;
};

/**
 * @param delay default 1000ms
 */
export const sleep = (delay = 1000) =>
  new Promise<void>(resolve => setTimeout(resolve, delay));
