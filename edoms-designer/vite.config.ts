import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

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
    server: {
      host: '0.0.0.0',
      port: 8890,
      proxy: {
        '/api': {
          target: 'http://192.100.4.42:8061',
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/\/api/, '');
          },
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
