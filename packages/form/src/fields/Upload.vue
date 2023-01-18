<template>
  <div>
    <ElButton class="select-file" :loading="selectLoading" @click="handleFileSelect">选择文件</ElButton>
    <div v-if="config.listType === 'picture'" class="picture-file-list">
      <div v-for="([, { fileName, status, url }], index) in files" :key="index" class="picture-wrapper">
        <div v-loading="status === 'uploading'" class="picture-file">
          <img :src="config.basePreviewUrl ? `${config.basePreviewUrl}${url}` : url" class="picture" />
          <div class="tool">
            <ElIcon class="item-delete" @click="handleDeleteFile(fileName)">
              <Delete />
            </ElIcon>
          </div>
        </div>
        <ElTooltip :content="fileName">
          <div class="file-name">{{ fileName }}</div>
        </ElTooltip>
      </div>
    </div>
    <div v-else>
      <div v-for="([, { fileName, status }], index) in files" :key="index" class="text-file">
        <ElButton :loading="status === 'uploading'" text>{{ fileName }}</ElButton>
        <ElButton text :icon="Delete" style="color: #f56c6c" @click="handleDeleteFile(fileName)"></ElButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
import { Delete } from '@element-plus/icons-vue';

import { ElButton, ElIcon, ElTooltip } from '@edoms/design';
import { getByPath } from '@edoms/utils';

import { FileStruct, FormState, UploadConfig } from '../schema';
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

const emit = defineEmits<{
  (emit: 'change', value: any): void;
}>();

const mForm = inject<FormState>('mForm');

useAddField(props.prop);

const { loading: selectLoading, execute: selectExecute } = useSelectFile();

const fileMap = new Map<string, FileStruct>();
const values = getByPath(props.model, props.prop, []);
if (Array.isArray(values)) {
  values.forEach((item: FileStruct) => {
    fileMap.set(item.fileName, item);
  });
}

const files = ref<Map<string, FileStruct>>(fileMap);

watch(
  () => Array.from(files.value.values()).filter(({ status }) => status === 'done'),
  (filesValue) => {
    props.model[props.prop] = filesValue;
    emit('change', filesValue);
  }
);

const handleDeleteFile = (fileName: string) => {
  files.value.delete(fileName);
};

const handleFileSelect = async () => {
  const selectedFiles = await selectExecute(props.config.accepts ?? ['*'], props.config.multiple);
  selectedFiles.forEach(uploadFile);
};

const uploadFile = async (file: File) => {
  if (typeof props.config.upload !== 'function') {
    return;
  }
  if (!props.config.multiple && !files.value.keys().next().done) {
    files.value.clear();
  }
  files.value.set(file.name, {
    fileName: file.name,
    fileType: file.type,
    fileSuffix: file.name.substring(file.name.lastIndexOf('.')),
    status: 'uploading',
    url: '',
  });
  const fileStruct = files.value.get(file.name);
  if (!fileStruct) {
    files.value.delete(file.name);
    return;
  }
  try {
    fileStruct.url = await props.config.upload(file, props.prop, mForm);
    fileStruct.status = 'done';
  } catch (error) {
    fileStruct.status = 'error';
  }
};
</script>

<style lang="scss" scoped>
.select-file {
  cursor: pointer;
}

.picture-file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.picture-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 1;
    }

    .item-delete {
      cursor: pointer;
      position: static;
      font-size: inherit;
      color: inherit;
    }
  }
}

.file-name {
  font-size: 10px;
  text-align: center;
  width: 100px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.text-file {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
