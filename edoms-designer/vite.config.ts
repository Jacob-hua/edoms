/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-18 13:24:10
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-21 11:02:50
 */
import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_URL,
    plugins: [
      vue(),
      vueSetupExtend(),
      createSvgIconsPlugin({
        // 指定SVG图标文件夹的路径
        iconDirs: [resolve(process.cwd(), 'src/assets/icons/editor')],
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
      }),
    ],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: r('./src'),
        },
        {
          find: /^@edoms\/editor\/src\/theme\/index.scss/,
          replacement: join(__dirname, '../packages/editor/src/theme/index.scss'),
        },
        { find: /^@edoms\/core/, replacement: join(__dirname, '../packages/core/src/index.ts') },
        { find: /^@edoms\/editor/, replacement: join(__dirname, '../packages/editor/src/index.ts') },
        { find: /^@edoms\/schema/, replacement: join(__dirname, '../packages/schema/src/index.ts') },
        { find: /^@edoms\/form/, replacement: join(__dirname, '../packages/form/src/index.ts') },
        { find: /^@edoms\/stage/, replacement: join(__dirname, '../packages/stage/src/index.ts') },
        { find: /^@edoms\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
        { find: /^@edoms\/design/, replacement: join(__dirname, '../packages/design/src/index.ts') },
        {
          find: /^@edoms\/element-plus-adapter/,
          replacement: join(__dirname, '../packages/element-plus-adapter/src/index.ts'),
        },
        { find: /^vue$/, replacement: join(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js') },
        { find: /^element-plus$/, replacement: join(__dirname, 'node_modules/element-plus/es/index.mjs') },
      ],
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
      host: '0.0.0.0',
      port: 8890,
      strictPort: true,
      proxy: {
        '/api': {
          // target: 'http://192.100.4.80:8061', //思昊
          // target: 'http://192.100.4.25:8062', //刘旺
          target: 'http://k8s.isiact.com/edoms-designtime-service-dev',
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/\/api/, '');
          },
        },
        '/edoms-runtime-service-dev': {
          //   target: 'http://192.100.4.80:8062', //思昊
          // target: 'http://192.100.4.25:8062', //刘旺
          target: 'http://k8s.isiact.com',
          changeOrigin: true,
        },
        '^/edoms-playground/runtime': {
          target: 'http://localhost:8078',
          changeOrigin: true,
          prependPath: false,
        },
        '^/edoms-playground/entry': {
          target: 'http://localhost:8078',
          changeOrigin: true,
          prependPath: false,
        },
      },
    },
  };
});
