import n3bulaWatcher from '@n3bula/watcher';

import type { RollupOptions } from 'rollup';
import type { RollupAliasOptions } from '@rollup/plugin-alias';
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import type { ExternalsOptions } from 'rollup-plugin-node-externals';
import type { RollupJsonOptions } from '@rollup/plugin-json';
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import type { RollupReplaceOptions } from '@rollup/plugin-replace';
import type { Options as EsbuildOptions } from 'rollup-plugin-esbuild';
import type { Options as DtsOptions } from 'rollup-plugin-dts';

export type WatcherCreator = typeof n3bulaWatcher;
export type Watcher = ReturnType<WatcherCreator>;
export type GetOptions<T> = T extends (paths: any, options: infer U, ...rest: any[]) => {} ? U : never;
export type WatcherOptions = GetOptions<WatcherCreator>;
export type NovaOptions = {
  nova?: {
    watchPaths?: string | readonly string[];
    input?: string;
    outputFile?: string;
    outputDtsFile?: string;
    tsconfigPath?: string;
    silent?: boolean;
    timeout?: number;
    alias?: RollupAliasOptions;
    nodeResolve?: RollupNodeResolveOptions;
    externals?: ExternalsOptions;
    json?: RollupJsonOptions;
    cjs?: RollupCommonJSOptions;
    replace?: RollupReplaceOptions;
    esbuild?: EsbuildOptions;
    dts?: DtsOptions;
    minify?: boolean | 'both';
  };
} & WatcherOptions &
  Omit<RollupOptions, 'input'>;
export type _RequiredNovaOptions = Exclude<Required<NovaOptions['nova']>, undefined>;
export type RequiredNovaOptions = NovaOptions & { nova: _RequiredNovaOptions };
