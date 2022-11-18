import { ref } from 'vue';

import { MimeType } from '@/const/mime';

export type ExportData = Record<string | number | symbol, any>;

type Func = (...args: any[]) => string;

export default (
  requestFunc: (data: ExportData) => string | Promise<string>,
  fileName: string | Func = 'edoms-download',
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
      if (typeof fileName === 'string') {
        link.download = fileName;
      } else {
        link.download = fileName();
      }
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
