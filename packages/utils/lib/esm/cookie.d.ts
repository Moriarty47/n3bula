type CookieOptions = {
    path?: string;
    maxAge?: number;
    expires?: string | number | Date;
    [k: string]: string | number | boolean | Date | undefined;
};
type CookiesProps = {
    options?: CookieOptions;
    transformer?: {
        read: (value: string) => string;
        write: (value: string) => string;
    };
};
export default function useCookies({ options, transformer }?: CookiesProps): {
    has: (name: string) => boolean;
    set: (name: string, value: string, options?: CookieOptions) => string | undefined;
    get: (...names: string[]) => Record<string, Array<string>>;
    size: () => number;
    delete(name: string, attributes: CookieOptions): void;
} | undefined;
export {};
