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
      '@edoms/utils': r('./packages/utils/src'),
      '@edoms/components': r('./packages/components/src'),
      '@edoms/attribute': r('./packages/attribute/src'),
      '@edoms/editor': r('./packages/editor/src'),
      '@edoms/meta-model': r('./packages/meta-model/src'),
      '@edoms/workshop': r('./packages/workshop/src'),
      '@edoms/engine': r('./packages/engine/src'),
    },
  },
})
