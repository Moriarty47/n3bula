import antfu from '@antfu/eslint-config';

import type {
  OptionsConfig,
  Rules,
  TypedFlatConfigItem,
} from '@antfu/eslint-config';

export * from '@antfu/eslint-config';

export const commonRules: Rules = {
  'antfu/if-newline': 'off',
  'style/comma-dangle': 'warn',
  'style/operator-linebreak': ['warn', 'after'],
  'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
  'style/object-curly-newline': ['warn', {
    ObjectPattern: { minProperties: 4, multiline: true },
    ImportDeclaration: { minProperties: 3, multiline: true },
    ExportDeclaration: { minProperties: 3, multiline: true },
  }],
  'style/object-property-newline': ['warn', {
    allowAllPropertiesOnSameLine: true,
    allowMultiplePropertiesPerLine: false,
  }],
  'style/function-call-argument-newline': ['warn', 'consistent'],
  'max-nested-callbacks': ['warn', { max: 4 }],
  'sort-keys': ['warn', 'asc', {
    allowLineSeparatedGroups: true,
    natural: true,
  }],
  'style/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }],
  'style/function-paren-newline': ['warn', { minItems: 4 }],
  'perfectionist/sort-imports': [
    'warn',
    {
      type: 'alphabetical',
      ignoreCase: false,
      internalPattern: ['^@/.*'],
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index'],
        'object',
        'style',
        'side-effect',
        'side-effect-style',
        'builtin-type',
        'external-type',
        'internal-type',
        ['parent-type', 'sibling-type', 'index-type'],
      ],
    },
  ],
  'perfectionist/sort-exports': [
    'warn',
    {
      type: 'line-length',
      groupKind: 'values-first',
    },
  ],
  'node/prefer-global/process': 'off',
};

export interface AntFuConfig extends ReturnType<typeof antfu> {};

export type ESLinterConfig = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>;

export type UserConfigs<T> = T extends (config: ESLinterConfig, ...userConfigs: infer U) => AntFuConfig ? U : never;

export default function useESLintConfig(config: ESLinterConfig = {}, ...userConfigs: UserConfigs<typeof antfu>): AntFuConfig {
  const { ignores = [], ...restOptions } = config;
  return antfu(
    {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
      typescript: true,
      vue: {
        overrides: {
          ...commonRules,
        },
      },
      ...restOptions,
      ignores: [
        '**/.vscode/**',
        '**/.idea/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/lib/**',
        'pnpm-*.yaml',
        ...ignores,
      ],
    },
    {
      files: ['**/*.js', '**/*.jsx', '**/*.ts'],
      rules: {
        ...commonRules,
      },
    },
    {
      files: ['**/*.mjs', '**/*.mts'],
      rules: {
        ...commonRules,
        'sort-keys': 'off',
      },
    },
    {
      files: ['**/*.json'],
      rules: {
        'jsonc/indent': ['warn', 2],
        'jsonc/sort-keys': 'off',
      },
    },
    {
      files: ['**/*.yaml', '**/*.yml'],
      rules: {
        'yaml/indent': ['warn', 2],
      },
    },
    ...userConfigs,
  );
}
