import { ref } from 'vue';

import { uploadFile } from '@/api/file';

export default (content: File | Blob | string, fileName: string, fileType: string, charset?: string) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (): Promise<string | null | undefined> => {
    try {
      if (typeof content === 'string') {
        content = new Blob([content], { type: `${fileType};charset=${charset}` });
      }
      loading.value = true;
      const { contentId } = await uploadFile({
        file: content,
        fileName,
        fileType,
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
