import { ref } from 'vue';

import { MApp, MPage, NodeType } from '@edoms/schema';

import { downloadFile } from '@/api/file';

export default (contentId: string) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async (): Promise<MApp | MPage | undefined> => {
    try {
      loading.value = true;
      const contentStream = (await downloadFile({ contentId })) as Blob;
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
