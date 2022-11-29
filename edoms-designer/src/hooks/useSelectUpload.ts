import { ref, watch } from 'vue';

import useSelectFile from './useSelectFile';
import useUpload from './useUpload';

export default (accepts: string[]) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const { error: selectError, execute: selectExecute } = useSelectFile(accepts);

  watch(
    () => selectError,
    (e) => {
      error.value = e;
    }
  );

  const execute = async () => {
    try {
      loading.value = true;
      const [file] = (await selectExecute()) ?? [];
      if (!file) {
        loading.value = false;
        throw new Error('Cancel select file!');
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
