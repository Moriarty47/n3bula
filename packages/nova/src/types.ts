import n3bulaWatcher from '@n3bula/watcher';

import type { RollupOptions } from 'rollup';
import type { RollupAliasOptions } from '@rollup/plugin-alias';
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import type { ExternalsOptions } from 'rollup-plugin-node-externals';
import type { RollupJsonOptions } from '@rollup/plugin-json';
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import type { Replacement, RollupReplaceOptions } from '@rollup/plugin-replace';
import type { Options as DtsOptions } from 'rollup-plugin-dts';

export type WatcherCreator = typeof n3bulaWatcher;
export type Watcher = ReturnType<WatcherCreator>;
export type GetOptions<T> = T extends (paths: any, options: infer U, ...rest: any[]) => {} ? U : never;
export type WatcherOptions = GetOptions<WatcherCreator>;
export type NovaInnerOptions = {
  watchPaths?: string | readonly string[];
  input?: string;
  outputFile?: string;
  outputDtsFile?: RollupOptions['input'];
  tsconfigPath?: string;
  silent?: boolean;
  timeout?: number;
  alias?: RollupAliasOptions;
  nodeResolve?: RollupNodeResolveOptions;
  externals?: ExternalsOptions;
  json?: RollupJsonOptions;
  cjs?: RollupCommonJSOptions;
  replace?: RollupReplaceOptions & {
    values?: { [str: string]: Replacement } | ((mode?: string) => { [str: string]: Replacement });
  };
  dts?: DtsOptions;
  minify?: boolean;
};
export type NovaOptions = {
  nova?: NovaInnerOptions;
} & WatcherOptions &
  RollupOptions;
export type RequiredNovaInnerOptions = Required<NovaInnerOptions>;
export type RequiredNovaOptions = NovaOptions & { nova: RequiredNovaInnerOptions };
