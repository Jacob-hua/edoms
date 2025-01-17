import { ref, watch } from 'vue';

import useSelectFile, { SelectFileError } from './useSelectFile';
import useUpload from './useUpload';

export interface SelectUploadResult {
  file: File;
  contentId: string;
}

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<SelectFileError | any>();

  const { error: selectError, execute: selectExecute } = useSelectFile();

  watch(
    () => selectError,
    (e) => {
      error.value = e;
    }
  );

  const execute = async (accepts: string[], multiple?: boolean): Promise<SelectUploadResult[]> => {
    try {
      loading.value = true;
      const files = (await selectExecute(accepts, multiple)) ?? [];
      if (!Array.isArray(files)) {
        loading.value = false;
        throw selectError.value;
      }
      const { error: uploadError, execute: uploadExecute } = useUpload();
      watch(
        () => uploadError.value,
        (e) => {
          error.value = e;
        }
      );
      return await Promise.all(
        files.map(async (file: File) => {
          const contentId = await uploadExecute(file, file.name, file.type);
          return {
            file,
            contentId,
          };
        })
      );
    } catch (e) {
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
