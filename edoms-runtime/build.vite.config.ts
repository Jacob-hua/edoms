import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const [type, isAdmin] = mode.split(':');
  const env = loadEnv(isAdmin ? 'admin' : 'development', process.cwd(), '');

  if (['value', 'config', 'event', 'value:admin', 'config:admin', 'event:admin'].includes(mode)) {
    const capitalToken = type.charAt(0).toUpperCase() + type.slice(1);
    return {
      publicDir: './.edoms/public',
      build: {
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        target: 'esnext',
        outDir: `${env.VITE_ENTRY_OUT_DIR}/${type}`,

        lib: {
          entry: `.edoms/${type}-entry.ts`,
          name: `edomsPreset${capitalToken}s`,
          fileName: 'index',
          formats: ['umd'],
        },
      },
    };
  }

  if (['page', 'playground', 'page:admin', 'playground:admin'].includes(mode)) {
    const base = `${env.VITE_BASE_URL}/${type}/`;
    const outDir = path.resolve(process.cwd(), `${env.VITE_OUT_DIR}/${type}`);
    return {
      plugins: [
        vue(),
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
      ],

      root: `./${type}/`,

      publicDir: path.resolve(__dirname, './public'),

      base,

      build: {
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
          input: path.resolve(process.cwd(), `./${type}/index.html`),
        },
        outDir,
      },
    };
  }

  return {};
});
