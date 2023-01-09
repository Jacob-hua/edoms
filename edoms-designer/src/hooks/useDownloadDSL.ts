import { ref } from 'vue';

import { MApp, MPage, NodeType } from '@edoms/schema';

import fileApi from '@/api/file';
import { MessageError } from '@/const/error';

export class DownloadDSLError extends MessageError {
  constructor(cause?: any) {
    super('dsl元数据下载失败');
    this.cause = cause;
  }
}

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<DownloadDSLError>();

  const execute = async (contentId: string): Promise<MApp | MPage> => {
    try {
      loading.value = true;
      const contentStream = (await fileApi.downloadFile({ contentId })) as Blob;
      const text = await contentStream.text();
      const result = new Function(`return ${text ?? undefined}`)();
      if (
        typeof result !== 'object' ||
        !Object.prototype.hasOwnProperty.call(result, 'type') ||
        ![NodeType.ROOT, NodeType.PAGE].includes(result.type)
      ) {
        throw new Error('This resource is not DSL!');
      }
      return result;
    } catch (e) {
      error.value = new DownloadDSLError(e);
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
