import debounce, { type DebounceFunc, type DebounceOptions } from './debounce';
import { isObject } from './is';

type ThrottleOptions = DebounceOptions;

type ThrottleFunc<T> = DebounceFunc<T>;

export default function throttle<T extends (...rest: any[]) => void>(
  func: T,
  delay: number,
  options: ThrottleOptions,
): ThrottleFunc<T> {
  let leading = true;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function.');
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce<T>(func, delay, {
    leading,
    maxDelay: delay,
    trailing,
  });
}
