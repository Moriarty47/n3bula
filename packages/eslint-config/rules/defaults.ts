import type { Rules } from '../types';

const commonRules: Rules = {
  'antfu/if-newline': 'off',
  'antfu/top-level-function': 'off',
  'ts/consistent-type-definitions': 'off',
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
  'max-nested-callbacks': ['warn', { max: 4 }],
  'style/function-call-argument-newline': ['warn', 'consistent'],
  'style/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }],
  'style/function-paren-newline': ['warn', 'multiline-arguments'],
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
  'sort-keys': 'off',
};

export default commonRules;
