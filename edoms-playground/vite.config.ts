import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueSetupExtend() as Plugin],
  base: '/edoms/playground',
  server: {
    fs: {
      strict: false,
    },
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '^/edoms/playground/runtime': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
        prependPath: false,
      },
      open: '/edoms/playground',
    },
  },
  build: {
    sourcemap: true,
  },
});
