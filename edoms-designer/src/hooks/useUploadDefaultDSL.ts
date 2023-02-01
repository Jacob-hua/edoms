import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import serialize from 'serialize-javascript';

import { MessageError } from '@/const/error';
import useAccountStore from '@/store/account';
import { generateDefaultDSL } from '@/util/dsl';

import useUpload from './useUpload';

export class UploadDefaultDSLError extends MessageError {
  constructor(cause?: any) {
    super({
      type: 'error',
      message: '新应用DSL上传失败',
      cause,
    });
  }
}

export default () => {
  const loading = ref<boolean>(false);

  const error = ref<UploadDefaultDSLError>();

  const execute = async (applicationId: string, applicationName: string): Promise<string> => {
    try {
      loading.value = true;
      const { error: uploadError, execute: uploadExecute } = useUpload();
      watch(
        () => uploadError.value,
        (e) => {
          error.value = e;
        }
      );
      const { currentTenant } = storeToRefs(useAccountStore());
      const dsl = generateDefaultDSL({ applicationId, applicationName, tenantId: currentTenant.value?.tenantId });
      const DSL = serialize(dsl, {
        space: 2,
        unsafe: true,
      }).replace(/"(\w+)":\s/g, '$1: ');
      return await uploadExecute(DSL, 'dsl.js', 'text/javascript', 'utf-8');
    } catch (e) {
      error.value = new UploadDefaultDSLError(e);
      throw error.value;
    }
  };

  return {
    loading,
    error,
    execute,
  };
};
