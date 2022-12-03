import { ref, watch } from 'vue';

import useSelectFile from './useSelectFile';
import useUpload from './useUpload';

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const { error: selectError, execute: selectExecute } = useSelectFile();

  watch(
    () => selectError,
    (e) => {
      error.value = e;
    }
  );

  const execute = async (accepts: string[]): Promise<string | undefined | null> => {
    try {
      loading.value = true;
      const [file] = (await selectExecute(accepts)) ?? [];
      if (!file) {
        loading.value = false;
        throw selectError.value;
      }
      const { error: uploadError, execute: uploadExecute } = useUpload(file, file.name, file.type);
      watch(
        () => uploadError,
        (e) => {
          error.value = e;
        }
      );
      return await uploadExecute();
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
