import Core from '@edoms/core';
import { Edoms } from '@edoms/stage';

declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    edoms: Edoms;
    appInstance: Core;
  }
}
