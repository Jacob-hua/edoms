import { ref } from 'vue';

import { selectFile } from '@edoms/utils';

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (accepts: string[], multiple?: boolean): Promise<File[] | undefined> => {
    try {
      loading.value = true;
      return await selectFile(accepts, multiple);
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
