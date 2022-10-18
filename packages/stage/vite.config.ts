import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types',
      include: ['src/**/*'],
      staticImport: true,
      insertTypesEntry: true,
      logDiagnostics: true,
    }),
  ],

  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            { find: /^@edoms\/engine/, replacement: path.join(__dirname, '../engine/src/index.ts') },
            { find: /^@edoms\/meta-model/, replacement: path.join(__dirname, '../meta-model/src/index.ts') },
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
          /^@tmagic\//.test(id) ||
          Object.keys(pkg.dependencies).some((k) => new RegExp(`^${k}`).test(id))
        );
      },
    },
  },
});
