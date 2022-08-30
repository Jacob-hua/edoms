const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 12,
  },
  rules: {
    'no-unused-vars': 1,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        semi: false,
        arrowParens: 'always',
        bracketSpacing: true,
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
        vueIndentScriptAndStyle: false,
        vueIndentHTML: false,
      },
    ],
  },
})
