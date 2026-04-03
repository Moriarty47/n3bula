export type ProgramOptions = {
  dev: boolean;
};

export type Command =
  | 'templateType'
  | 'packageName'
  | 'libraryName'
  | 'libarayDesc'
  | 'gitAuthor'
  | 'gitAuthorEmail'
  | 'packageVersion'
  | 'packageKeywords';

export type CommandOptions = Record<Command, string>;
