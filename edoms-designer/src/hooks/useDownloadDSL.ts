import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import { MApp, MPage, NodeType } from '@edoms/schema';

import fileApi from '@/api/file';

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

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
      error.value = e;
      ElMessage.error(`下载DSL元数据失败`);
      throw e;
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
