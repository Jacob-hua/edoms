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
    // eslint (http://eslint.cn/docs/rules)
    'no-var': ['error'], //禁止使用var
    'no-multiple-empty-lines': ['error', { max: 1 }], // 禁止多行空白行
    'no-debugger': ['error'], // 禁止使用debugger
    'no-unused-vars': ['off'], // 未使用变量检查
    'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }], // 优先使用const

    // typeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'local', args: 'none', ignoreRestSiblings: true, caughtErrors: 'none' },
    ], // 未使用变量检查
    '@typescript-eslint/class-literal-property-style': ['error', 'getters'], // 只读字面量风格检查
    '@typescript-eslint/no-empty-function': ['off'], // 禁止使用空方法

    // vue (https://eslint.vuejs.org/rules)
    'vue/padding-line-between-blocks': ['error'], // <template/>和<script/>之间必须空行
    'vue/no-mutating-props': ['error'], // 禁止改变prop
    'vue/block-lang': ['error', { script: { lang: 'ts' } }], // script的lang必须是ts
    'vue/component-name-in-template-casing': ['error'], // template中组件名必须是PascalCase
    'vue/component-tags-order': [
      'error',
      {
        order: ['template', 'script:not([setup])', 'script[setup]', 'style'],
      },
    ], // 组件标签顺序
    'vue/attributes-order': [
      'error',
      {
        order: [
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'DEFINITION',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
      },
    ], // 组件属性顺序
    'vue/order-in-components': [
      'error',
      {
        order: [
          'name',
          ['components', 'directives'],
          ['mixins', 'provide', 'inject'],
          'props',
          'emits',
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          ['template', 'render'],
          'renderError',
        ],
      },
    ], // 组件属性声明顺序
    'vue/custom-event-name-casing': ['error', 'camelCase', { ignores: ['/^[a-z]+(?:-[a-z]+)*:update$/u'] }], // 自定义事件名
    'vue/require-explicit-emits': ['error'], // 自定义事件必须声明
    'vue/v-on-event-hyphenation': ['error'], // v-on要求使用-连接
    'vue/v-on-function-call': ['error'], // 禁止在v-on为没有参数的方法添加括号
    'vue/no-lone-template': ['error'], // 禁止没有属性的<template></template>
    'vue/no-unused-refs': ['error'], // 检查未使用的refs
    'vue/no-useless-v-bind': ['error'], // 带有字符串值的v-bind改为静态属性
    'vue/no-static-inline-styles': ['error'], // 禁止行内静态style样式
    'vue/no-undef-properties': ['error', { ignores: ['/^\\$/'] }], // 检查未定义的属性
    'vue/no-unused-properties': ['error', { groups: ['props', 'data'] }], // 检查未使用的属性
    'vue/require-expose': ['error'], // 组件向外暴漏的属性或方法必须使用expose声明

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
