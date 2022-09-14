import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
  },
  resolve: {
    alias: {
      '@edoms/utils': r('./packages/utils'),
      '@edoms/components': r('./packages/components'),
      '@edoms/attribute': r('./packages/attribute'),
      '@edoms/editor': r('./packages/editor'),
    },
  },
})
