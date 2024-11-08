import type { REPLServer } from 'node:repl';

export const createAskQuestion = (repl: REPLServer) => async (query: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ac = new AbortController();
    const signal = ac.signal;

    repl.question(query, { signal }, resolve);

    signal.addEventListener('abort', () => {
      reject('Aborted.');
    }, { once: true });

    repl.once('SIGINT', () => ac.abort('Aborted.'));
  });
};

export type AskQuestion = ReturnType<typeof createAskQuestion>;