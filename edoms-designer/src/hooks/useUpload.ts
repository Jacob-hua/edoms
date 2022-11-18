import { ref } from 'vue';

import { uploadFile } from '@/api/file';

export default (file: File) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (): Promise<string | null | undefined> => {
    try {
      loading.value = true;
      const { contentId } = await uploadFile({
        file: file,
        fileName: file.name,
        fileType: file.type,
      });
      return contentId;
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
