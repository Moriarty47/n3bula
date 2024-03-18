export const capitalize = (str: string = '') => {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toUpperCase() + rest;
};

export const decapitalize = (str: string = '') => {
  if (!str) return '';
  const firstLetter = str.slice(0, 1) || '';
  const rest = str.slice(1);
  return String(firstLetter).toLowerCase() + rest;
};

export const camel2kebab = (str: string = '') => {
  if (!str) return '';
  return (str || '')
    .replace(/([A-Z])(\w)/g, (_, p1, p2) => `-${p1.toLowerCase()}${p2}`)
    .replace(/_/gm, '-');
};

export const kebab2camel = (str: string = '') => {
  if (!str) return '';
  return (str || '')
    .replace(/[-_](\w)/g, (_, p1) => p1.toUpperCase());
};

export const is32Bit = (char: string, i: number): boolean => {
  return char.codePointAt(i)! > 0xffff;
};

export const getCodePointLength = (str: string): number => {
  let len = 0;
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    if (is32Bit(str, i)) i++;
    len++;
  }
  return len;
};

export const isAllSameChar = (str: string, char: string): boolean => {
  return new RegExp(`^(${char})\\1*$`).test(str);
};

export const getCharLength = (str: string): number => {
  return str.replace(/[^\x00-\xff]/g, '  ').length;
};

export const padStart = (str: string, length: number, char: string): string => {
  const strLen = getCodePointLength(str);
  const padding = char.repeat(Math.max(0, length - strLen));
  return padding + str;
};

export const padEnd = (str: string, length: number, char: string): string => {
  const strLen = getCodePointLength(str);
  const padding = char.repeat(Math.max(0, length - strLen));
  return str + padding;
};

export const padStartEnd = (str: string, length: number, char1: string = '', char2: string = char1): string => {
  const strLen = getCodePointLength(str);
  const paddingLen = Math.max(0, length - strLen);
  const leftPadingLen = Math.floor(paddingLen / 2);
  const rightPadingLen = paddingLen - leftPadingLen;
  return char1.repeat(leftPadingLen) + str + char2.repeat(rightPadingLen);
};

export const emptyPadStart = (length: number, str: string = '', pad: string = ''): string => {
  return padStart(str, length, pad);
};