import { resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_URL,
    plugins: [vue(), vueSetupExtend()],
    build: {
      emptyOutDir: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8890,
      proxy: {
        '/api': {
          // target: 'http://192.100.4.25:8061',
          target: 'http://k8s.isiact.com/edoms-designtime-service-dev',
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/\/api/, '');
          },
        },
        '^/edoms/playground/runtime': {
          target: 'http://127.0.0.1:8078',
          changeOrigin: true,
          prependPath: false,
        },
      },
      open: true,
    },
    resolve: {
      alias: {
        '@': r('./src'),
      },
    },
  };
});
