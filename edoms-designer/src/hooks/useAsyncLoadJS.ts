import { ref } from 'vue';
import { ElMessage } from 'element-plus';

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
    } catch (e: any) {
      const asyncLoadError = new Error(`Failed to load ${paths}`, { cause: e });
      error.value = asyncLoadError;
      ElMessage.error(`远程资源加载失败`);
      throw asyncLoadError;
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
