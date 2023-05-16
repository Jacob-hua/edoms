import path from 'path';

import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';

/**
 * 处理环境变量
 *
 * @param param0
 * @returns
 */
const handleModeEnv = ({ mode }: ConfigEnv) => {
  const [type, _mode] = mode.split(':');
  const env = loadEnv(_mode, process.cwd(), '');
  return {
    type,
    _mode,
    env,
  };
};

/**
 * 依赖包打包配置
 *
 * @param config
 * @returns
 */
const buildLibsConfig: UserConfigExport = (config: ConfigEnv) => {
  const { type, env } = handleModeEnv(config);
  const capitalToken = type.charAt(0).toUpperCase() + type.slice(1);
  return {
    publicDir: './.edoms/public',
    build: {
      cssCodeSplit: false,
      sourcemap: true,
      minify: false,
      target: 'esnext',
      outDir: `${env.VITE_ENTRY_OUT_DIR}/${type}`,

      lib: {
        entry: `.edoms/${type}-entry.ts`,
        name: `edomsPreset${capitalToken}s`,
        fileName: 'index',
        formats: ['umd'],
      },
    },
  };
};

/**
 * 渲染器打包配置
 *
 * @param config
 * @returns
 */
const buildRendererConfig: UserConfigExport = (config: ConfigEnv) => {
  const { type, env } = handleModeEnv(config);
  const base = `${env.VITE_BASE_URL}/${type}/`;
  const outDir = path.resolve(process.cwd(), `${env.VITE_OUT_DIR}/${type}`);
  return {
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],

    root: path.resolve(__dirname, `./${type}/`),

    publicDir: path.resolve(__dirname, './config'),

    base,

    build: {
      emptyOutDir: true,
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        chunkFileNames: (chunkInfo: any) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
          const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `js/${fileName}/[name].[hash].js`;
        },
        input: path.resolve(process.cwd(), `./${type}/index.html`),
      },
      outDir,
    },
  };
};

/**
 * 离线包打包配置
 *
 * @param config
 * @returns
 */
const buildOfflineConfig: UserConfigExport = (config: ConfigEnv) => {
  const { type, env } = handleModeEnv(config);
  const base = `${env.VITE_BASE_URL}`;

  const outDir = path.resolve(process.cwd(), `${env.VITE_OUT_DIR}`);
  return {
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],

    root: `./${type}/`,

    publicDir: path.resolve(__dirname, './config'),

    base,

    build: {
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: path.resolve(process.cwd(), `./${type}/index.html`),
      },
      outDir,
    },
  };
};

const configFactory: Record<string, UserConfigExport> = {
  'value:dev': buildLibsConfig,
  'value:pre': buildLibsConfig,
  'config:dev': buildLibsConfig,
  'config:pre': buildLibsConfig,
  'event:dev': buildLibsConfig,
  'event:pre': buildLibsConfig,
  'page:dev': buildRendererConfig,
  'page:pre': buildRendererConfig,
  'playground:dev': buildRendererConfig,
  'playground:pre': buildRendererConfig,
  'page:offline': buildOfflineConfig,
};

export default defineConfig((config: ConfigEnv) => {
  const configExport = configFactory[config.mode];
  if (typeof configExport === 'function') {
    return configExport(config);
  }
  return {};
});
