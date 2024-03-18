import { isObject } from './is';
import root from './root';

export type DebounceOptions = Partial<{
  leading: boolean;
  trailing: boolean;
  maxDelay: number;
}>;

export type DebounceFunc = (...rest: any[]) => void;

export default function debounce(
  func: DebounceFunc,
  delay: number,
  options?: DebounceOptions
): DebounceFunc {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function.');
  }

  let
    result: any,
    timerId: number | undefined,
    lastArgs: any[] | undefined,
    lastThis: any | undefined,
    lastCallTime: number | undefined;

  let leading = false;
  let trailing = true;
  let maxing = false;
  let maxDelay = 0;
  let lastInvokeTime = 0;

  if (isObject(options)) {
    leading = !!options.leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
    maxing = 'maxWait' in options;
    maxDelay = maxing ? Math.max(options.maxDelay || 0, delay) : maxDelay;
  }

  const useRAF = (!delay && delay !== 0 && typeof root.requestAnimationFrame === 'function');

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as any[]);
    return result;
  }

  function startTimer(pendingFunc: DebounceFunc, delay: number) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, delay);
  }

  function cancelTimer(id: number) {
    if (useRAF) {
      return root.cancelAnimationFrame(id);
    }
    return clearTimeout(id);
  }

  function remainingDelay(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeDelaying = delay - timeSinceLastCall;
    return maxing
      ? Math.min(timeDelaying, maxDelay - timeSinceLastInvoke)
      : timeDelaying;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return (lastCallTime === undefined || timeSinceLastCall >= delay)
      || (timeSinceLastCall < 0)
      || (maxing && timeSinceLastInvoke >= maxDelay);
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) return trailingEdge(time);
    timerId = startTimer(timerExpired, remainingDelay(time));
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timerId = startTimer(timerExpired, delay);
    return leading ? invokeFunc(time) : result;
  }

  function trailingEdge(time: number) {
    timerId = undefined;
    if (trailing && lastArgs) return invokeFunc(time);
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = startTimer(timerExpired, delay);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, delay);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}