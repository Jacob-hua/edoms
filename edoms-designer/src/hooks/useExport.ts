import { ref } from 'vue';

import { MimeType } from '@/const/mime';

export type ExportData = Record<string | number | symbol, any>;

export default (
  requestFunc: (data: ExportData) => string | Promise<string>,
  fileName: string = 'edoms-download',
  mime: MimeType = MimeType.HTML,
  charset: string = 'utf-8'
) => {
  const loading = ref<boolean>(false);

  const error = ref(null);

  const execute = async (data: ExportData) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await Promise.resolve(requestFunc(data));
      const blob = new Blob([res], { type: `${mime};charset=${charset}` });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error: any) {
      error.value = error;
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
