import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
  },
  resolve: {
    alias: {
      '@editor': r('./packages/editor/src'),
      '@form': r('./packages/form/src'),
      '@edoms/core': r('./packages/core/src'),
      '@edoms/utils': r('./packages/utils/src'),
      '@edoms/editor': r('./packages/editor/src'),
      '@edoms/stage': r('./packages/stage/src'),
      '@edoms/schema': r('./packages/schema/src'),
    },
  },
});
