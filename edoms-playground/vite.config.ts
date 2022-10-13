import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueSetupExtend()],
  server: {
    proxy: {
      '^/edoms/playground/runtime/playground.html': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
});
