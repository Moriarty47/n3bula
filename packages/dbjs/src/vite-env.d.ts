/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | (string & {});
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}