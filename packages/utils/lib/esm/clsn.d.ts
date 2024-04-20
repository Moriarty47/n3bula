export type BaseType = number | string | boolean | null | undefined;
type ClsType = BaseType | BaseType[] | Record<string, any>;
export declare function clsn(...rest: ClsType[]): string;
export default clsn;
