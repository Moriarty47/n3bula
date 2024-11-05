import repl from 'node:repl';
import { tagify, NOOP } from '@/utils';
import { parse } from '@/parser';
import { commands, COMMANDS } from '@/commands';
import type { Completer } from 'node:readline';
import type { REPLEval, REPLWriter } from 'node:repl';

export const startREPL = () => {

  const completer: Completer = (line) => {
    const completions = Object.values(COMMANDS).map(k => k.toUpperCase());
    const hits = completions.filter(c => c.startsWith(line.toUpperCase()));
    return [hits.length ? hits : completions, line];
  };

  const writer: REPLWriter = (output) => {
    if (output === NOOP.name) return '';

    switch (typeof output) {
      case 'object': {
        if (output.error) return output.error.message;
        if (output.message) return output.message;
        return JSON.stringify(output, null, 2);
      }
      default:
        return tagify(output);
    }
  };

  const evaluator: REPLEval = (evalCmd, _, __, callback) => {
    evalCmd = evalCmd.trim().replace('\n', '').toLowerCase();

    if (!evalCmd) return callback(null, NOOP.name);

    if (evalCmd === COMMANDS.EXIT.toLowerCase()) {
      process.exit(0);
      // return;
    }

    let ast = parse(evalCmd);
    if (!Array.isArray(ast)) {
      ast = [ast];
    }

    const commandSet: { type: string; params: any; execute: (params: any) => void; }[] = ast.map((st: { type: string, params: any; }) => {
      return ({
        ...st,
        execute: commands.find(
          command => command.type.toLowerCase() === st.type.toLowerCase()
        )?.execute ?? NOOP,
      });
    });

    if (commandSet.length === 1) {
      const command = commandSet[0];
      console.table(command.execute(command.params));
      callback(null, 'Done.');
    } else {
      console.table(commandSet.map(({ execute, params }) => execute(params)));
      callback(null, 'Done.');
    }
  };

  repl.start({
    prompt: 'db > ',
    completer,
    writer,
    eval: evaluator,
  });
};;