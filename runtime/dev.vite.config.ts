import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],

  resolve: {
    alias: [
      { find: /^vue$/, replacement: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js') },
      { find: /^@edoms\/utils/, replacement: path.join(__dirname, '../packages/utils/src/index.ts') },
      { find: /^@edoms\/core/, replacement: path.join(__dirname, '../packages/core/src/index.ts') },
      { find: /^@edoms\/schema/, replacement: path.join(__dirname, '../packages/schema/src/index.ts') },
    ],
  },

  root: './',

  base: '/edoms/playground/runtime',

  publicDir: 'public',

  server: {
    host: '0.0.0.0',
    port: 8078,
    strictPort: true,
  },

  build: {
    sourcemap: true,

    cssCodeSplit: false,

    rollupOptions: {
      input: {
        page: './page/index.html',
        playground: './playground/index.html',
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
