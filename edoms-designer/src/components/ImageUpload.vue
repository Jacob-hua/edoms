<template>
  <div class="upload-wrapper">
    <div class="image-wrapper" @click="handlePreview"><PreviewImage :content-id="contentId" /></div>
    <el-button type="primary" :loading="selectUploadLoading" @click="handleUpload">上传图片</el-button>
    <el-dialog v-model="dialogVisible">
      <preview-image :content-id="contentId"></preview-image>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="ImageUpload">
import { onMounted, ref } from 'vue';

import PreviewImage from '@/components/ImagePreview.vue';
import useSelectUpload from '@/hooks/useSelectUpload';

const props = withDefaults(
  defineProps<{
    thumbnailId?: string;
  }>(),
  {
    thumbnailId: () => '',
  }
);

const emits = defineEmits<{
  (event: 'success', contentId: string): void;
}>();

const { execute: selectUploadExecute, loading: selectUploadLoading } = useSelectUpload();

const contentId = ref<string>('');

const dialogVisible = ref<boolean>(false);

onMounted(() => {
  contentId.value = props.thumbnailId;
});

const handleUpload = async () => {
  const imgFormat = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'];
  const uploadResults = await selectUploadExecute(imgFormat);
  contentId.value = uploadResults[0].contentId;
  emits('success', contentId.value);
};
const handlePreview = () => {
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    height: 600px;
  }
}
.upload-wrapper {
  :deep(.el-icon) {
    width: 1.5em !important;
    height: 1.5em !important;
    svg {
      width: 1.5em !important;
      height: 1.5em !important;
    }
  }
  display: flex;
  align-items: flex-end;
  .image-wrapper {
    cursor: pointer;
    padding: 2px;
    border: 1px solid #999999;
    border-radius: 5px;
    width: 200px;
    height: 200px;
    margin: 10px 10px 0 0;
  }
}
</style>
