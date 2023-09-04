import { isObject } from '.';
import debounce from './debounce';
export default function throttle(func, delay, options) {
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
}
;
//# sourceMappingURL=throttle.js.map