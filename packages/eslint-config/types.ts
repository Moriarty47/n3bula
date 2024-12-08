import type antfu from '@antfu/eslint-config';
import type { OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config';

export interface AntFuConfig extends ReturnType<typeof antfu> {};

export type ESLinterConfig = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>;

export type UserConfigs<T> = T extends (config: ESLinterConfig, ...userConfigs: infer U) => AntFuConfig ? U : never;

export type { Rules } from '@antfu/eslint-config';
