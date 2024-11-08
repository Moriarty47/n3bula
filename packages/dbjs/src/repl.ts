import path from 'node:path';
import repl from 'node:repl';
import { parse } from '@/parser';
import { emitter } from '@/emitter';
import { createAskQuestion } from '@/ask';
import { commands, COMMANDS } from '@/commands';
import { preloadDatabase, databases } from '@/database/preload';
import { tagify, NOOP, DONE, NOOP_Promise, logger, currentWorkingDirectory } from '@/utils';
import type { AskQuestion } from '@/ask';
import type { Completer } from 'node:readline';
import type { REPLEval, REPLServer, REPLWriter } from 'node:repl';
import type { CommandType, ExecuteFunc } from '@/commands/command-factory';

type ParserResult = {
  type: CommandType;
  execute: ExecuteFunc<any, any>;
  [key: string]: any;
};
type ParserResults = ParserResult | ParserResult[] | undefined;

export const startREPL = () => {
  let replHandler: REPLServer;
  let askQuestion: AskQuestion;
  const replHistoryPath = path.resolve(currentWorkingDirectory, './db/.dbjs_repl_history');

  const completer: Completer = (line) => {
    const completions = Object.values(COMMANDS).map(k => k.toUpperCase());
    const hits = completions.filter(c => c.startsWith(line.toUpperCase()));
    return [hits.length ? hits : completions, line];
  };

  const writer: REPLWriter = (output) => {
    if (output === NOOP.name) return `Invalid command`;

    switch (typeof output) {
      case 'object': {
        if (output.error) return output.error.message;
        if (output.message) return output.message;
        return JSON.stringify(output, null, 2);
      }
      default:
        return output;
    }
  };

  const evaluator: REPLEval = async (evalCmd, _, __, callback) => {
    evalCmd = evalCmd.trim().replace('\n', '');

    if (!evalCmd) return callback(null, NOOP.name);

    if (evalCmd.toLowerCase() === COMMANDS.EXIT.toLowerCase()) {
      replHandler?.close();
      return;
    }

    let ast: ParserResults = parse(evalCmd);

    if (!ast) return callback(null, NOOP.name);

    if (!Array.isArray(ast)) {
      ast = [ast];
    }

    const commandSet = ast.map(st => {
      const command = commands.find(
        cmd => st.type.includes(cmd.type)
      );
      return ({
        ...st,
        execute: command?.execute ?? NOOP_Promise,
      });
    });

    let result: { data: any[]; msg: string; } = { data: [], msg: DONE };

    // Every time create new ask
    askQuestion = createAskQuestion(replHandler);

    if (commandSet.length === 1) {
      const { execute, ...params } = commandSet[0];
      result = await (execute(params, databases, emitter, askQuestion)
        .catch((reason) => ({ msg: reason })));
    } else {
      result.data = await Promise.all(
        commandSet.map(({ execute, ...params }) => execute(params, databases, emitter, askQuestion))
      );
    }

    const { data, msg = DONE } = result;

    data && console.table(data);
    callback(null, msg);
  };

  replHandler = repl.start({
    prompt: `${tagify()} > `,
    input: process.stdin,
    output: process.stdout,
    completer,
    writer,
    eval: evaluator,
  });

  preloadDatabase(replHandler);

  replHandler.setupHistory(replHistoryPath, (err) => err && console.error(err));

  replHandler.on('close', () => {
    databases.forEach(database => {
      database.close();
    });
    logger('Bye!', 'white', 'reset');
  });
};;