import { isObject } from '.';
import root from './root';
/** @public */
export default function debounce(func, delay, options) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function.');
    }
    let result, timerId, lastArgs, lastThis, lastCallTime;
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
    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function startTimer(pendingFunc, delay) {
        if (useRAF) {
            root.cancelAnimationFrame(timerId);
            return root.requestAnimationFrame(pendingFunc);
        }
        return setTimeout(pendingFunc, delay);
    }
    function cancelTimer(id) {
        if (useRAF) {
            return root.cancelAnimationFrame(id);
        }
        return clearTimeout(id);
    }
    function remainingDelay(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeDelaying = delay - timeSinceLastCall;
        return maxing
            ? Math.min(timeDelaying, maxDelay - timeSinceLastInvoke)
            : timeDelaying;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined || timeSinceLastCall >= delay)
            || (timeSinceLastCall < 0)
            || (maxing && timeSinceLastInvoke >= maxDelay);
    }
    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time))
            return trailingEdge(time);
        timerId = startTimer(timerExpired, remainingDelay(time));
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, delay);
        return leading ? invokeFunc(time) : result;
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs)
            return invokeFunc(time);
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
    function debounced(...args) {
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
//# sourceMappingURL=debounce.js.map