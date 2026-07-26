import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vitestPlugin from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.eslintRecommended,
      // ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
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
    files: ['src/**/*.test.ts'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      vitestPlugin.configs.recommended
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...vitestPlugin.environments.env.globals,
      },
    },
    plugins: {
      vitest: vitestPlugin,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    rules: {},
  },
]);
