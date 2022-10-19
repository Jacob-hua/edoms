import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore
import externalGlobals from 'rollup-plugin-external-globals';

export default defineConfig(({ command, mode }) => {
  const { WATCH_INCLUDE = '', BASE, OUT_DIR } = loadEnv(mode, process.cwd(), '');
  const libInput = {
    config: './src/config-entry.ts',
    value: './src/value-entry.ts',
    event: './src/event-entry.ts',
  };

  // const htmlInput = {
  //   page: './page.html',
  //   playground: './playground.html',
  // };

  const buildConfig = {
    outDir: OUT_DIR || 'dist',

    sourcemap: true,

    cssCodeSplit: false,

    rollupOptions: {
      input: {
        ...libInput,
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
    // rollupOptions: {
    //   input:
    //     command === 'build' && mode !== 'lib'
    //       ? {
    //           ...htmlInput,
    //           ...libInput,
    //         }
    //       : libInput,
    //   output: {
    //     entryFileNames: 'assets/[name].js',
    //   },
    // },
  };
  console.log('start');

  if (mode === 'lib') {
    return {
      build: {
        ...buildConfig,
        watch: {
          include: WATCH_INCLUDE.split(','),
        },
      },
    };
  }

  console.log('end');

  return {
    base: BASE || '/tmagic-editor/playground/runtime/vue3',

    plugins: [vue(), vueJsx(), externalGlobals({ vue: 'Vue' }, { exclude: ['page.html', 'playground.html'] })],

    resolve: {
      alias: [
        { find: /^vue$/, replacement: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js') },
        { find: /^@tmagic\/utils/, replacement: path.join(__dirname, '../../packages/utils/src/index.ts') },
        { find: /^@tmagic\/core/, replacement: path.join(__dirname, '../../packages/core/src/index.ts') },
        { find: /^@tmagic\/schema/, replacement: path.join(__dirname, '../../packages/schema/src/index.ts') },
      ],
    },

    publicDir: command === 'serve' ? 'dist' : 'public',

    server: {
      host: '0.0.0.0',
    },

    build: buildConfig,
  };
});
