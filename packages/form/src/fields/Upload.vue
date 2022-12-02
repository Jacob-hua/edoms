<template>
  <div>
    <ElButton :loading="selectLoading" @click="handleFileUpload">文件上传</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from '@edoms/design';

import { UploadConfig } from '../schema';
import { useAddField } from '../utils/useAddField';
import useSelectFile from '../utils/useSelectFile';

const props = defineProps<{
  config: UploadConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  size: 'mini' | 'small' | 'medium';
}>();

defineEmits<{
  (emit: 'change', value: any): void;
}>();

useAddField(props.prop);

const { loading: selectLoading, execute: selectExecute } = useSelectFile(
  props.config.accepts ?? ['*'],
  props.config.multiple
);

const handleFileUpload = () => {
  selectExecute().then((res) => {
    console.log(res, '~~~~~~~~~~~~~');
  });
};
</script>
