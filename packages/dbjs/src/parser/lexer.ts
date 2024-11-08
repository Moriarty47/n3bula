import { DBError } from '@/utils';
import moo from 'moo';

const createCaseInsensitiveRegex = (word: string) => new RegExp(`${word.toUpperCase()}(?=\\s)|${word.toLowerCase()}(?=\\s)`);

export const lexer = moo.states({
  start: {
    ws: { match: /\s+/, lineBreaks: true },
    create: { match: createCaseInsensitiveRegex('create'), push: 'create_mid' },
    use: { match: createCaseInsensitiveRegex('use') },
    drop: { match: createCaseInsensitiveRegex('drop') },
    select: { match: createCaseInsensitiveRegex('select') },
    from: { match: createCaseInsensitiveRegex('from') },
    where: { match: createCaseInsensitiveRegex('where') },
    insert: { match: createCaseInsensitiveRegex('insert') },
    into: { match: createCaseInsensitiveRegex('into') },
    values: { match: createCaseInsensitiveRegex('values') },
    delete_: { match: createCaseInsensitiveRegex('delete') },
    update: { match: createCaseInsensitiveRegex('update') },
    set: { match: createCaseInsensitiveRegex('set') },
    on: { match: createCaseInsensitiveRegex('on') },
    and: 'AND',
    or: 'OR',
    identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: /\d+/,
    string: {
      match: /"(?:[^"]|\")*?"|'(?:[^']|\')*?'|(?<=\=\s+)[^"']+?/,
      value(x) {
        if (['\"', '\''].some(m => x.startsWith(m))) {
          return x.slice(1).slice(0, -1);
        }
        return x;
      }
    },
    lparen: '(',
    rparen: ')',
    lBracket: '[',
    rBracket: ']',
    lcBracket: '{',
    rcBracket: '}',
    comma: ',',
    dot: '.',
    colon: ':',
    semiColon: ';',
    star: '*',
    equal: '=',
    unequal: '!=',
    bigger: '>',
    smaller: '<',
    biggerEqual: '>=',
    smallerEqual: '<=',
    // operators: /[<>]=?|=|!=/,
  },
  create_mid: {
    ws: { match: /\s+/, lineBreaks: true },
    error: {
      match: /(?:[^TABLE|table|INDEX|index])/,
      error: true,
      value(x) {
        throw new DBError(`Invalid identifier "${x}", Did you forget to use keyword "DATABASE", "TABLE" or "INDEX"?`);
      }
    },
    database: { match: createCaseInsensitiveRegex('database'), push: 'start' },
    table: { match: createCaseInsensitiveRegex('table'), push: 'start' },
    index: { match: createCaseInsensitiveRegex('index'), push: 'start' },
  },
});