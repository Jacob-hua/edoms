import { ref } from 'vue';

import { asyncLoadJs } from '@edoms/utils';

export interface Callback {
  (...args: any[]): void;
}

export default (paths: string[], callback: Callback) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async () => {
    try {
      loading.value = true;

      await Promise.all(paths.map((path: string) => asyncLoadJs(path)));

      callback();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    execute,
    loading,
    error,
  };
};
