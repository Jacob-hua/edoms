<template>
  <div>
    <ElButton :loading="selectLoading" @click="handleFileSelect">选择文件</ElButton>
    <div v-for="([, { fileName, status, url }], index) in files" :key="index">
      <div v-if="config.listType === 'picture'" class="picture-file">
        <img v-loading="status === 'uploading'" :src="url" class="picture" />
        <div class="tool">
          <ElIcon @click="handleDeleteFile(fileName)">
            <Delete />
          </ElIcon>
        </div>
      </div>
      <div v-else class="text-file">
        <ElButton :loading="status === 'uploading'" text>{{ fileName }}</ElButton>
        <ElButton text :icon="Delete" style="color: #f56c6c" @click="handleDeleteFile(fileName)"></ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Delete } from '@element-plus/icons-vue';

import { ElButton, ElIcon } from '@edoms/design';

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
  });
  const fileStruct = files.value.get(file.name);
  if (!fileStruct) {
    files.value.delete(file.name);
    return;
  }
  try {
    fileStruct.url = await props.config.upload(file);
    fileStruct.status = 'done';
  } catch (error) {
    fileStruct.status = 'error';
  }
};
</script>

<style lang="scss" scoped>
.picture-file {
  overflow: hidden;
  width: 148px;
  height: 148px;
  display: inline-flex;

  .picture {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .tool {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 148px;
    height: 148px;
    cursor: default;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;

    &:hover {
      opacity: 1;
    }
  }
}
.text-file {
  display: flex;
}
</style>
