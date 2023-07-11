import { ref } from 'vue';

import { selectFile } from '@edoms/utils';

import { MessageError } from '@/const/error';

import i18n from '../locales';
const { t } = i18n.global;

export class SelectFileError extends MessageError {
  constructor(accepts: string[], cause?: any) {
    super({
      type: cause.type === 'CancelSelect' ? 'warning' : 'error',
      message:
        cause.type === 'WrongFormat'
          ? `${t('errorTips.请选择')}${accepts}${t('errorTips.文件')}`
          : cause.type === 'CancelSelect'
          ? t('errorTips.取消文件选择')
          : t('errorTips.文件选择异常'),
      cause,
    });
  }
}

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<SelectFileError>();

  const execute = async (accepts: string[], multiple?: boolean): Promise<File[]> => {
    try {
      loading.value = true;
      return await selectFile(accepts, multiple);
    } catch (e: any) {
      error.value = new SelectFileError(accepts, e);
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
