import { ref } from 'vue';

import { asyncLoadJs } from '@edoms/utils';

import { MessageError } from '@/const/error';

export class AsyncLoadJSError extends MessageError {
  constructor(paths: string[], cause?: any) {
    super(`Failed to load ${paths}`);
    this.cause = cause;
  }
}

export interface Callback {
  (...args: any[]): void;
}

export default (paths: string[], callback: Callback) => {
  const loading = ref<boolean>(false);

  const error = ref<AsyncLoadJSError>();

  const execute = async () => {
    try {
      loading.value = true;

      await Promise.all(paths.map((path: string) => asyncLoadJs(path)));

      callback();
    } catch (e: any) {
      error.value = new AsyncLoadJSError(paths, e);
      throw error.value;
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
