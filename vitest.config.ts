import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
  },
  resolve: {
    alias: {
      '@edoms/utils': r('./packages/utils'),
      '@edoms/components': r('./packages/components'),
      '@edoms/form': r('./packages/form'),
      '@edoms/editor': r('./packages/editor'),
    },
  },
})
