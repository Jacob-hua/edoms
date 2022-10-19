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
            { find: /^@tmagic\/core/, replacement: path.join(__dirname, '../core/src/index.ts') },
            { find: /^@tmagic\/schema/, replacement: path.join(__dirname, '../schema/src/index.ts') },
            { find: /^@tmagic\/utils/, replacement: path.join(__dirname, '../utils/src/index.ts') },
          ],
  },

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    lib: {
      entry: 'src/index.ts',
      name: 'TMagicStage',
      fileName: 'tmagic-stage',
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
