export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends {} ? DeepPartial<T[P]> : T[P];
};
export declare const simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;
