import { ref } from 'vue';

import { MessageError } from '@/const/error';
import { MimeType } from '@/const/mime';

import i18n from '../locales';
const { t } = i18n.global;
export class ExportError extends MessageError {
  constructor(fileName: string, cause?: any) {
    super({
      type: 'error',
      message: `${t('errorTips.导出')}${fileName}${t('errorTips.失败')}`,
      cause,
    });
  }
}

export type FileName<T> = string | ((data?: T) => string);

const useExport = <T = Record<string | number | symbol, any>>(
  requestFunc: (data?: T) => string | Promise<string>,
  fileName: FileName<T> = 'edoms-download',
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

export default useExport;
