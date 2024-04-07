import type { LoadOptions, DumpOptions } from 'js-yaml';
export type ExtractOptions = LoadOptions;
export type SerializeOptions = DumpOptions;
export type Frontmatter = Record<string, any>;
export type ExtractResult = {
    frontmatter: Frontmatter;
    body: string;
    bodyBegin: number;
};
export declare const extract: (content: string, options?: ExtractOptions) => ExtractResult;
export declare const serialize: (object: Frontmatter, options: SerializeOptions) => string;
