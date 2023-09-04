export type DebounceOptions = {
    leading: boolean;
    trailing: boolean;
    maxDelay: number;
};
export type DebounceFunc = (...rest: any[]) => void;
/** @public */
export default function debounce(func: DebounceFunc, delay: number, options: DebounceOptions): DebounceFunc;
//# sourceMappingURL=debounce.d.ts.map