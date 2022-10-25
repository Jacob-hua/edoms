import path from 'path';

import { defineConfig } from 'vite';

import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            { find: /^@edoms\/core/, replacement: path.join(__dirname, '../core/src/index.ts') },
            { find: /^@edoms\/schema/, replacement: path.join(__dirname, '../schema/src/index.ts') },
            { find: /^@edoms\/utils/, replacement: path.join(__dirname, '../utils/src/index.ts') },
          ],
  },

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    lib: {
      entry: 'src/index.ts',
      name: 'EdomsStage',
      fileName: 'edoms-stage',
    },

    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external(id: string) {
        return (
          /^vue/.test(id) ||
          /^@edoms\//.test(id) ||
          Object.keys(pkg.dependencies).some((k) => new RegExp(`^${k}`).test(id))
        );
      },
    },
  },
});
