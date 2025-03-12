import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ),
  {
    ignores: ['dist'],
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'indent': ['error', 2],
      'multiline-ternary': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'function-paren-newline': ['error', 'multiline-arguments'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'array-element-newline': ['error', 'consistent'],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_',
        },
      ],
    },
  }
];
