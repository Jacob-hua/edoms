import { ref } from 'vue';

import { selectFile } from '@edoms/utils';

import { MessageError } from '@/const/error';

export class SelectFileError extends MessageError {
  constructor(accepts: string[], cause?: any) {
    super({
      type: cause.type === 'CancelSelect' ? 'warning' : 'error',
      message:
        cause.type === 'WrongFormat'
          ? `请选择${accepts}文件`
          : cause.type === 'CancelSelect'
          ? '取消文件选择'
          : '文件选择异常',
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
