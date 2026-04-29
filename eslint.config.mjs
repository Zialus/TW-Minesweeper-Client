import globals from 'globals';
import js from '@eslint/js';
import vitestPlugin from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {},
  },
  {
    files: ['src/**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...vitestPlugin.globals,
      },
    },
    plugins: {
      vitest: vitestPlugin,
    },
    rules: vitestPlugin.configs.recommended.rules,
  },
]);
