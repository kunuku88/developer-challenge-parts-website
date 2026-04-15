// @ts-check
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import vueParser from 'vue-eslint-parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**', 'dist/**'],
  },

  // Use TypeScript parser for .ts files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
  },

  // Vue rules — each flat/recommended item already includes plugin + parser declarations
  ...pluginVue.configs['flat/recommended'],

  // Configure TS parser for Vue script blocks
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },

  // TypeScript rules
  {
    files: ['**/*.{ts,vue}'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: { ...tsPlugin.configs.recommended.rules },
  },

  // A11y + import sort
  {
    plugins: {
      'vuejs-accessibility': pluginVueA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...pluginVueA11y.configs['flat/recommended'].rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Must be last — disables rules that conflict with Prettier
  prettier,

  // Nuxt pages & layouts use file-based routing — single-word names are intentional
  {
    files: ['app/pages/**/*.vue', 'app/layouts/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
]

