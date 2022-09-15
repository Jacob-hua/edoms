import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const r = (p: string) => resolve(__dirname, p)
  return {
    plugins: [vue()],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': r('./src'),
      },
    },
  }
})
