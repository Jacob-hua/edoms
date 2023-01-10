import { ref } from 'vue';

import { elMessage } from '@edoms/design';
import { selectFile } from '@edoms/utils';

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (accepts: string[], multiple?: boolean): Promise<File[]> => {
    try {
      loading.value = true;
      return await selectFile(accepts, multiple);
    } catch (e: any) {
      if (e.type === 'WrongFormat') {
        elMessage.error(`请选择${e.accepts}文件`);
      }
      error.value = e;
      throw e;
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
