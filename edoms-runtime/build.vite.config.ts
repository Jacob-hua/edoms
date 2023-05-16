import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const [type, _mode] = mode.split(':');
  const env = loadEnv(_mode ?? 'development', process.cwd(), '');

  if (['value', 'config', 'event', 'value:preview', 'config:preview', 'event:preview'].includes(mode)) {
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

  if (['page', 'playground', 'page:preview', 'playground:preview'].includes(mode)) {
    const base = `${env.VITE_BASE_URL}/${type}/`;
    const outDir = path.resolve(process.cwd(), `${env.VITE_OUT_DIR}/${type}`);
    return {
      plugins: [
        vue(),
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
      ],

      root: path.resolve(__dirname, `./${type}/`),

      publicDir: path.resolve(__dirname, './config'),

      base,

      build: {
        emptyOutDir: true,
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1500,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
        rollupOptions: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          chunkFileNames: (chunkInfo: any) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
          },
          input: path.resolve(process.cwd(), `./${type}/index.html`),
        },
        outDir,
      },
    };
  }

  if (['page:offline'].includes(mode)) {
    const base = `${env.VITE_BASE_URL}`;

    const outDir = path.resolve(process.cwd(), `${env.VITE_OUT_DIR}`);
    return {
      plugins: [
        vue(),
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
      ],

      root: `./${type}/`,

      publicDir: path.resolve(__dirname, './config'),

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
