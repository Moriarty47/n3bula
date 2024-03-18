import { isObject } from './is';
import debounce from './debounce';
export default function throttle(func, delay, options) {
    var leading = true;
    var trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function.');
    }
    if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, delay, {
        leading: leading,
        trailing: trailing,
        maxDelay: delay
    });
}
;
