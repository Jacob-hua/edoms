import { ref } from 'vue';

import fileApi from '@/api/file';

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (
    content: File | Blob | string,
    fileName: string,
    fileType: string,
    charset?: string,
    referenceIds?: string
  ): Promise<string | null | undefined> => {
    try {
      if (typeof content === 'string') {
        content = new Blob([content], { type: `${fileType};charset=${charset}` });
      }
      loading.value = true;
      const { contentId } = await fileApi.uploadFile({
        file: content,
        fileName,
        fileType,
        referenceIds,
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
