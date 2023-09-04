import { type DebounceOptions, type DebounceFunc } from './debounce';
type ThrottleOptions = DebounceOptions;
type ThrottleFunc = DebounceFunc;
export default function throttle(func: ThrottleFunc, delay: number, options: ThrottleOptions): DebounceFunc;
export {};
//# sourceMappingURL=throttle.d.ts.map