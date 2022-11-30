import { ref } from 'vue';

import { downloadFile } from '@/api/file';

export default (contentId: string) => {
  const loading = ref<boolean>(false);

  const error = ref<any>(null);

  const execute = async () => {
    const contentStream = (await downloadFile({ contentId })) as Blob;
    const text = await contentStream.text();
    return new Function(`return ${text ?? undefined}`)();
  };

  return {
    execute,
    loading,
    error,
  };
};
