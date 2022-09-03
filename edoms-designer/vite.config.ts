import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

const r = (p: string) => resolve(__dirname, p)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueSetupExtend()],
  server: {
    host: '0.0.0.0',
    port: 8890,
    proxy: {
      '/api': {
        target: 'http://192.100.4.42:8061',
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/\/api/, '')
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
})
