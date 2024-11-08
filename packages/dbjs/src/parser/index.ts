import nearlay, { Token } from 'nearley';
import grammar from './grammar/grammar';
import { isDev } from '@/utils';

class NewParser extends nearlay.Parser {
  reportError(token: Token): string {
    return this.lexer.formatError(token, "Syntax error");
  }
}

const Parser = isDev ? nearlay.Parser : NewParser;

export const parse = (input: string) => {
  try {
    const parser = new Parser(
      nearlay.Grammar.fromCompiled(grammar)
    );

    parser.feed(input);

    console.time('label');
    const result = parser.finish()[0];
    console.timeEnd('label');
    
    return result;
  } catch (error: any) {
    console.error(error.message);
  }
};