import type { LoadOptions, DumpOptions } from 'js-yaml';
export type ExtractOptions = LoadOptions;
export type SerializeOptions = DumpOptions;
export type Frontmatter = Record<string, any>;
export type ExtractResult = {
    frontmatter: Frontmatter;
    body: string;
    bodyBegin: number;
};
/**
 * extract the markdown frontmatter from the contents
 * @param content content to extract
 * @param options extract options
 * @returns extracted result
 */
export declare const extract: (content: string, options?: ExtractOptions) => ExtractResult;
/**
 * serializes the frontmatter object
 * @param object frontmatter to serialize
 * @param options serialize options
 * @returns serialized result
 */
export declare const serialize: (object: Frontmatter, options: SerializeOptions) => string;
