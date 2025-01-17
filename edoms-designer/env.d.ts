/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_ENV: string;
  readonly VITE_BASE_API: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_PREVIEW_PATH: string;
  readonly VITE_FILE_PREVIEW_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'serialize-javascript';

declare module 'vue3-json-viewer' {
  const gyf: any;
  export default gyf;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}
