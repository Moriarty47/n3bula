import useESLintConfig, { commonRules } from '@n3bula/eslint-config';

export default useESLintConfig({
  ignores: [
    '**/utils/lib/**/*',
  ]
}, {
  files: ['**/webpack.*'],
  rules: {
    ...commonRules,
    'no-console': 'off',
  },
});
