import { ref } from 'vue';

import { MessageError } from '@/const/error';
import { MimeType } from '@/const/mime';

export class ExportError extends MessageError {
  constructor(fileName: string, cause?: any) {
    super({
      type: 'error',
      message: `导出${fileName}失败`,
    });
    this.cause = cause;
  }
}

type Func = <T>(arg: T) => string;

export default <T = Record<string | number | symbol, any>>(
  requestFunc: (data?: T) => string | Promise<string>,
  fileName: string | Func = 'edoms-download',
  mime: MimeType = MimeType.HTML,
  charset: string = 'utf-8'
) => {
  const loading = ref<boolean>(false);

  const error = ref<ExportError>();

  const execute = async (data?: T): Promise<void> => {
    loading.value = true;
    if (typeof fileName === 'function') {
      fileName = fileName(data);
    }
    try {
      const res = await Promise.resolve(requestFunc(data));
      const blob = new Blob([res], { type: `${mime};charset=${charset}` });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (e: any) {
      error.value = new ExportError(fileName, e);
      throw error.value;
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
