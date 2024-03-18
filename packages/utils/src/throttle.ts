import { isObject } from './is';
import debounce, {
  type DebounceOptions,
  type DebounceFunc
} from './debounce';

type ThrottleOptions = DebounceOptions;

type ThrottleFunc = DebounceFunc;

export default function throttle(func: ThrottleFunc, delay: number, options: ThrottleOptions) {
  let leading = true;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function.');
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce(func, delay, {
    leading,
    trailing,
    maxDelay: delay
  });
};
