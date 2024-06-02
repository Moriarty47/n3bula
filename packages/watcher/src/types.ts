export type WatchEvent =
  | 'add'
  | 'addDir'
  | 'change'
  | 'rename'
  | 'unlink'
  | 'unlinkDir';

export type WatchFunction = (event: WatchEvent, ...any: any[]) => void;

export type WatcherHandlers =
  | Record<WatchEvent, WatchFunction | undefined>
  | WatchFunction;


export type INO = string | undefined;

export type INO_S = Record<string, INO>;

export type Resolver = () => void;

export type Lock = Record<string, (() => any) | undefined>;

export type LockOptions = {
  locks: { read: Lock; write: Lock; };
  handlers: {
    free: () => void;
    override: (release: string) => void;
    overridden: () => void;
  };
};