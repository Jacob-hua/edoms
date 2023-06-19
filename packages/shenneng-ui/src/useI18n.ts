import { inject } from 'vue';

import Core from '@edoms/core';

const useI18n = () => {
  const app = inject<Core | undefined>('app');

  const t = (str: string): string => {
    if (!app) {
      return str;
    }
    return app.t(str);
  };

  const setMessage = (message: Record<string, any>): void => {
    if (!app) {
      return;
    }
    app.setMessage(message);
  };

  return {
    t,
    setMessage,
  };
};

export default useI18n;
