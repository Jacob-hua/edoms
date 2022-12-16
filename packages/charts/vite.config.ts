import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            { find: /^@edoms\/schema/, replacement: path.join(__dirname, '../schema/src/index.ts') },
            { find: /^@edoms\/utils/, replacement: path.join(__dirname, '../utils/src/index.ts') },
            { find: /^@edoms\/core/, replacement: path.join(__dirname, '../core/src/index.ts') },
            { find: /^@edoms\/form/, replacement: path.join(__dirname, '../form/src/index.ts') },
            { find: /^@edoms\/stage/, replacement: path.join(__dirname, '../stage/src/index.ts') },
          ],
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'EdomsCharts',
      fileName: 'edoms-charts',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return Object.keys(pkg.dependencies).some((k) => new RegExp(`^${k}`).test(id));
      },

      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
});
