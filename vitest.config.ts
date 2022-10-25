import { resolve } from 'path';

import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  plugins: [Vue()],

  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**'],
    include: [
      './packages/editor/tests/**',
      './packages/form/tests/unit/utils/**',
      './packages/stage/tests/**',
      './packages/utils/tests/**',
    ],
    environment: 'jsdom',
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
