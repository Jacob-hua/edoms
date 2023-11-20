import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],

    resolve: {
      alias: [
        { find: /^vue$/, replacement: path.join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js') },
        { find: /^@edoms\/utils/, replacement: path.join(__dirname, '../packages/utils/src/index.ts') },
        { find: /^@edoms\/core/, replacement: path.join(__dirname, '../packages/core/src/index.ts') },
        { find: /^@edoms\/schema/, replacement: path.join(__dirname, '../packages/schema/src/index.ts') },
        { find: /^@edoms\/design/, replacement: path.join(__dirname, '../packages/design/src/index.ts') },
        {
          find: /^@edoms\/element-plus-adapter/,
          replacement: path.join(__dirname, '../packages/element-plus-adapter/src/index.ts'),
        },
      ],
    },

    root: './',

    base: env.VITE_BASE_URL,

    publicDir: './config',

    server: {
      host: '0.0.0.0',
      port: 8078,
      strictPort: true,
    },

    optimizeDeps: {
      include: [
        'vue',
        '@edoms/cli',
        '@edoms/core',
        '@edoms/schema',
        '@edoms/stage',
        '@edoms/utils',
        'element-plus',
        'element-plus/es/locale/lang/*.mjs',
        'element-plus/es/components/**/style/css',
      ],
      esbuildOptions: {
        minify: true,
      },
    },

    build: {
      sourcemap: true,

      cssCodeSplit: false,

      commonjsOptions: {
        include: [/@edoms\//, /node_modules/],
      },

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
