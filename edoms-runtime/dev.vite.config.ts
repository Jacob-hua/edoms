import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
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

    base: env.VITE_BASE_URL,

    publicDir: './public',

    server: {
      host: '0.0.0.0',
      port: 8078,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://192.100.4.25:8062',
          // target: 'http://k8s.isiact.com/edoms-runtime-service-dev',
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/\/api/, '');
          },
        },
      },
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
  };
});
