export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, any> ? DeepPartial<T[P]> : T[P];
};
export type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends ((k: infer U) => void) ? U : never;
export declare const simpleMerge: <T extends Record<string, any>>(source: T, object?: DeepPartial<T>) => T;
export declare const assignMerge: <T extends Record<string, any>, U extends Record<string, any>[]>(target: T, ...rest: U) => T & UnionToIntersection<U[number]>;
