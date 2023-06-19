import { inject } from 'vue';

import Core from '@edoms/core';

export const useLocales = () => {
  const app = inject<Core | undefined>('app');

  function t(str: string): string {
    if (!app) {
      return str;
    }
    return app.t(str);
  }

  function setMessage(message: Record<string, any>): void {
    if (!app) {
      return;
    }
    app.setMessage(message);
  }

  return {
    t,
    setMessage,
  };
};

export default useLocales;
