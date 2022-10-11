import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const { VITE_WATCH_INCLUDE = '', VITE_BASE, VITE_OUT_DIR } = loadEnv(mode, process.cwd(), '')

  const htmlInput = {
    page: './index.html',
  }

  const buildConfig = {
    outDir: VITE_OUT_DIR,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      input:
        command === 'build' && mode !== 'dev'
          ? {
              ...htmlInput,
            }
          : htmlInput,
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  }

  if (mode === 'dev') {
    return {
      build: {
        ...buildConfig,
        watch: {
          include: VITE_WATCH_INCLUDE.split(','),
        },
      },
    }
  }

  return {
    base: VITE_BASE,
    plugins: [vue(), vueSetupExtend()],
    server: {
      host: '0.0.0.0',
    },
    build: {
      ...buildConfig,
    },
  }
})
