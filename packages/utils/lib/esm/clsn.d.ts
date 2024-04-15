type ClsType = string | number | (string | number)[] | Record<string, any> | undefined;
export declare function clsn(...rest: ClsType[]): string;
export default clsn;
