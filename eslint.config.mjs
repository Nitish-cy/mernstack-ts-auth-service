// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // 🔹 Ignore tooling & build files
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },

  // 🔹 Base ESLint rules
  eslint.configs.recommended,

  // 🔹 TypeScript rules (type-checked)
  tseslint.configs.recommendedTypeChecked,

  // 🔹 TypeScript project service
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'dot-notation': 'error',
    },
  },
);
