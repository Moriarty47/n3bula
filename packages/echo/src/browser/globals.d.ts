declare var process: {
  versions?: {
    [key: string]: string | undefined;
  };
  env: {
    [key: string]: string | undefined;
  };
};

interface ImportMetaEnv {
  MODE: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
