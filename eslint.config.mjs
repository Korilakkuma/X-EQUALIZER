// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      'parser': tseslint.parser,
      'globals': {
        'XSound': 'readonly',
        'X': 'readonly',
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest
      },
    },
    plugins: {
      '@typescript-lint': tseslintPlugin,
      'import': importPlugin,
      'jsx-a11y': a11yPlugin,
      'jest-dom': jestDomPlugin,
      'prettier': prettierPlugin
    },
    extends: [
      ...tseslint.configs.recommended
    ],
    rules: {
      'default-param-last': 'off',
      'indent': ['error', 2, {
        'ignoredNodes': ['TemplateLiteral'],
        'SwitchCase': 1
      }],
      'key-spacing': 'off',
      'no-case-declarations': 'error',
      'no-console': 'warn',
      'no-constant-condition': 'off',
      'no-else-return': 'error',
      'no-multi-spaces': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-vars': ['off', { 'vars': 'all', 'args': 'after-used' }],
      'no-var': 'warn',
      'prefer-promise-reject-errors': 'off',
      'quote-props': 'off',
      'quotes': ['error', 'single'],
      'radix': 'warn',
      'semi': ['error', 'always'],
      'space-before-function-paren': 'off',
      'template-curly-spacing': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-use-before-define': 'error',
    },
    settings: {
      'import/resolver': {
        'typescript': {}
      },
      'react': {
        'version': "detect"
      }
    }
  }
);
