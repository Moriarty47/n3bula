export type DebounceOptions = Partial<{
    leading: boolean;
    trailing: boolean;
    maxDelay: number;
}>;
export type DebounceFunc = (...rest: any[]) => void;
export default function debounce(func: DebounceFunc, delay: number, options?: DebounceOptions): DebounceFunc;
