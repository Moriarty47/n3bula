type ClsType = string | number | (string | number)[] | Record<string, any>;
export declare function clsn(...rest: ClsType[]): string;
export default clsn;
