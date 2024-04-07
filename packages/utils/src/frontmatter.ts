import yaml from 'js-yaml';
import type { LoadOptions, DumpOptions } from 'js-yaml';

const optionalByteOrderMark = '\\ufeff?';
const platform = typeof process !== 'undefined' ? process.platform : '';
const isWin32 = platform === 'win32';
const regex = new RegExp(`^(${optionalByteOrderMark}(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$${isWin32 ? '\\r?' : ''}(?:\\n)?)`, 'm');

export type ExtractOptions = LoadOptions;
export type SerializeOptions = DumpOptions;
export type Frontmatter = Record<string, any>;
export type ExtractResult = {
  frontmatter: Frontmatter;
  body: string;
  bodyBegin: number;
};

const getBodyBegin = (content: string, matched: RegExpExecArray) => {
  let start = 1;
  let pos = content.indexOf('\n');
  const offset = matched.index + matched[0].length;
  while (pos !== -1) {
    if (pos >= offset) return start;
    start++;
    pos = content.indexOf('\n', pos + 1);
  }
  return start;
};

const parse = (content: string, options: ExtractOptions): ExtractResult => {
  const matched = regex.exec(content);
  if (!matched) return {
    frontmatter: {},
    body: content,
    bodyBegin: 1,
  };

  const str = matched[matched.length - 1].replace(/^\s+|\s+$/g, '');
  const frontmatter = yaml.load(str, options) as Frontmatter;
  return {
    frontmatter,
    body: content.replace(matched[0], ''),
    bodyBegin: getBodyBegin(content, matched),
  };
};

export const extract = (content: string, options: ExtractOptions = {}): ExtractResult => {
  const _options: ExtractOptions = {
    json: true,
    ...options
  };

  const [line] = content.split(/(\r?\n)/);
  if (line && /= yaml =|---/.test(line)) {
    return parse(content, _options);
  }
  return {
    frontmatter: {},
    body: content,
    bodyBegin: 1,
  };
};

export const serialize = (object: Frontmatter, options: SerializeOptions) => {
  const _options: SerializeOptions = {
    skipInvalid: true,
    ...options,
  };

  return yaml.dump(object, _options);
};
