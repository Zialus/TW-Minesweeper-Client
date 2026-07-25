import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vitestPlugin from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: [
      eslint.configs.recommended,
      // tseslint.configs.eslintRecommended,
      // ...tseslint.configs.strictTypeChecked,
      // ...tseslint.configs.stylisticTypeChecked,  
    ],
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    rules: {},
  },
  {
    extends: [
      eslint.configs.recommended,
      // tseslint.configs.eslintRecommended,
      // ...tseslint.configs.strictTypeChecked,
      // ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['src/**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...vitestPlugin.globals,
      },
    },
    plugins: {
      vitest: vitestPlugin,
    },
    rules: { ...vitestPlugin.configs.recommended.rules },
  },
]);
