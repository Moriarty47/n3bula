import nearley from 'nearley';
import grammar from './grammar/grammar';

export const parse = (input: string) => {
  try {
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(grammar)
    );

    parser.feed(input);

    return parser.finish()[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};