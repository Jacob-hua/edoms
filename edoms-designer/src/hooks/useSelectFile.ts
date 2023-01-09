import { ref } from 'vue';

import { selectFile } from '@edoms/utils';

import { MessageError } from '@/const/error';

export class SelectFileError extends MessageError {
  constructor(accepts: string[], cause?: any) {
    super(
      cause.type === 'WrongFormat'
        ? `请选择${accepts}文件`
        : cause.type === 'CancelSelect'
        ? '取消选择'
        : '文件选择异常'
    );
    this.cause = cause;
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
