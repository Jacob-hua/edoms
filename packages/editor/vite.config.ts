import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pack from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'EdomsEditor',
      fileName: 'edoms-editor',
    },
    rollupOptions: {
      external(id: string) {
        return (
          /^vue/.test(id) ||
          /^element-plus/.test(id) ||
          /^@edoms\//.test(id) ||
          Object.keys(pack.dependencies).some((key) => new RegExp(`^${key}`).test(id))
        );
      },
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
});
