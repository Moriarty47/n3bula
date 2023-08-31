import { UnionWithException } from '@n3bula/utils';

/** @public */
export declare const loadCSS: () => void;

declare type MarkType = UnionWithException<[
'string',
'number',
'boolean',
'symbol',
'bigInt',
'null',
'undefined',
'array',
'object',
'date',
'regexp',
'function',
'mark'
]>;

declare const presetMarks: (options: PrettyJSONOptions) => {
    typeMark: (value: string | number | boolean, type: MarkType) => string;
    TAB: string;
    QUOTE: string;
    SPACE: string;
    LINEBREAK: string;
    SEMI: string;
    ARROW: string;
    COMMA: string;
    ARRAYLT: string;
    ARRAYRT: string;
    OBJECTLT: string;
    OBJECTRT: string;
    NULL: string;
    UNDEFINED: string;
    CIRCULAR_ERROR: string;
    DATE: (value: Date) => string;
    ERROR: (value: string) => string;
    ITALIC: (value: string) => string;
    STRING: (value: string) => string;
    NUMBER: (value: number) => string;
    SYMBOL: (value: symbol) => string;
    BIGINT: (value: bigint) => string;
    BOOLEAN: (value: boolean) => string;
    FUNCTION: (value: string) => string;
    OBJECTKEY: (value: string) => string;
};

/** @public */
declare const prettyJSONFormatter: (content: unknown, options?: Partial<Omit<PrettyJSONOptions, 'htmlMarks'>>) => string;
export default prettyJSONFormatter;
export { prettyJSONFormatter }

/** @public */
export declare type PrettyJSONOptions = {
    output: 'html' | 'text';
    indent: number;
    htmlMarks: ReturnType<typeof presetMarks>;
    quoteKeys: boolean;
    singleQuote: boolean;
    oneLineArray: boolean;
    trailingComma: boolean;
};

export declare const render: (domID: string | HTMLElement, content: string) => void;

/** @public */
export declare const toHTML: (content: unknown, options?: Omit<Partial<PrettyJSONOptions>, 'output'>) => {
    value: string;
    render(domID: string | HTMLElement): void;
};

/** @public */
export declare const toText: (content: unknown, options?: Omit<Partial<PrettyJSONOptions>, 'output'>) => {
    value: string;
    render(domID: string | HTMLElement): void;
};

export { }
