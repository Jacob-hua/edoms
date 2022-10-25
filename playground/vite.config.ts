import path from 'path';

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],

  base: '/edoms/playground/',

  resolve: {
    alias: [
      {
        find: /^@edoms\/editor\/src\/theme\/index.scss/,
        replacement: path.join(__dirname, '../packages/editor/src/theme/index.scss'),
      },
      { find: /^@edoms\/core/, replacement: path.join(__dirname, '../packages/core/src/index.ts') },
      { find: /^@edoms\/editor/, replacement: path.join(__dirname, '../packages/editor/src/index.ts') },
      { find: /^@edoms\/schema/, replacement: path.join(__dirname, '../packages/schema/src/index.ts') },
      { find: /^@edoms\/form/, replacement: path.join(__dirname, '../packages/form/src/index.ts') },
      { find: /^@edoms\/table/, replacement: path.join(__dirname, '../packages/table/src/index.ts') },
      { find: /^@edoms\/stage/, replacement: path.join(__dirname, '../packages/stage/src/index.ts') },
      { find: /^@edoms\/utils/, replacement: path.join(__dirname, '../packages/utils/src/index.ts') },
      { find: /^@edoms\/design/, replacement: path.join(__dirname, '../packages/design/src/index.ts') },
      {
        find: /^@edoms\/element-plus-adapter/,
        replacement: path.join(__dirname, '../packages/element-plus-adapter/src/index.ts'),
      },
      { find: /^vue$/, replacement: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js') },
      { find: /^element-plus$/, replacement: path.join(__dirname, 'node_modules/element-plus/es/index.mjs') },
    ],
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  server: {
    fs: {
      strict: false,
    },
    host: '0.0.0.0',
    port: 8098,
    strictPort: true,
    proxy: {
      '^/edoms/playground/runtime': {
        target: 'http://127.0.0.1:8078',
        changeOrigin: true,
        prependPath: false,
      },
    },
    open: '/edoms/playground/',
  },

  preview: {
    proxy: {},
  },

  build: {
    sourcemap: true,
  },
});
