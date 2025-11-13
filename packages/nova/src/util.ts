const NOVA = '@n3bula/nova';

export const logger: Record<'info' | 'success' | 'warn' | 'error', (...msgs: any[]) => void> = {
  info: (...msgs) => console.log(`\x1b[34m${NOVA}\x1b[m`, ...msgs),
  success: (...msgs) => console.log(`\x1b[32m${NOVA}\x1b[m`, ...msgs),
  warn: (...msgs) => console.log(`\x1b[33m${NOVA}\x1b[m`, ...msgs),
  error: (...msgs) => {
    const key = msgs[0];
    if (typeof key === 'object' && key.code && key.message) {
      console.log(`\x1b[31m${NOVA} ${key.code}\x1b[m`, key.message);
      return;
    }
    console.log(`\x1b[31m${NOVA}\x1b[m`, ...msgs);
  },
};
