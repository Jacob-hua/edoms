<template>
  <div>
    <ElButton :loading="selectLoading" @click="handleFileSelect">选择文件</ElButton>
    <div v-for="([, { fileName, status, percentage }], index) in files" :key="index">
      <div v-if="config.listType === 'picture'"></div>
      <div v-else class="text-file-list">
        <span>{{ fileName }}</span>
        <el-progress
          :percentage="percentage"
          :status="status === 'done' ? 'success' : status === 'error' ? 'exception' : ''"
        />
        <ElButton text :icon="Delete" style="color: #f56c6c" @click="handleDeleteFile(fileName)"></ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Delete } from '@element-plus/icons-vue';

import { ElButton } from '@edoms/design';

import { FileStruct, UploadConfig } from '../schema';
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

const files = ref<Map<string, FileStruct>>(new Map());

const handleDeleteFile = (fileName: string) => {
  files.value.delete(fileName);
};

const handleFileSelect = async () => {
  const selectedFiles = await selectExecute();
  if (!selectedFiles) {
    return;
  }
  selectedFiles.forEach(uploadFile);
};

const uploadFile = async (file: File) => {
  if (typeof props.config.upload !== 'function') {
    return;
  }
  files.value.set(file.name, {
    fileName: file.name,
    fileType: file.type,
    status: 'uploading',
    url: '',
    percentage: 0,
  });
  const fileStruct = files.value.get(file.name);
  if (!fileStruct) {
    files.value.delete(file.name);
    return;
  }
  const intervalId = setInterval(() => {
    if (['done', 'error'].includes(fileStruct.status)) {
      fileStruct.percentage = 100;
      clearInterval(intervalId);
      return;
    }
    if (fileStruct.percentage >= 90 && fileStruct.status === 'uploading') {
      clearInterval(intervalId);
      return;
    }
    fileStruct.percentage = (fileStruct.percentage % 100) + 10;
  }, 500);
  try {
    fileStruct.url = await props.config.upload(file);
    fileStruct.status = 'done';
  } catch (error) {
    fileStruct.status = 'error';
  } finally {
    fileStruct.percentage = 100;
    clearInterval(intervalId);
  }
};
</script>

<style lang="scss" scoped>
.text-file-list {
  display: flex;
}
</style>
