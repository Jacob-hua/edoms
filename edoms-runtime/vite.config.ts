import { defineConfig, loadEnv, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const { VITE_BASE, VITE_OUT_DIR, VITE_WATCH_INCLUDE = '' } = loadEnv(mode, process.cwd(), '');

  const buildConfig = {
    outDir: VITE_OUT_DIR || 'dist',
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        value: './src/value-entry.ts',
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  };

  if (mode === 'lib') {
    return {
      build: {
        ...buildConfig,
        watch: {
          include: VITE_WATCH_INCLUDE.split(','),
        },
      },
    };
  }

  return {
    base: VITE_BASE || '/edoms/playground/runtime/',
    plugins: [vue(), vueSetupExtend() as Plugin],
    publicDir: command === 'serve' ? 'dist' : 'public',
    server: {
      host: '0.0.0.0',
    },
    build: {
      ...buildConfig,
    },
  };
});
