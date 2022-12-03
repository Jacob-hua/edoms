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
import { onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

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
  (event: 'success', contentId: string | null): void;
}>();

const { execute: selectUploadExecute, loading: selectUploadLoading, error: selectUploadError } = useSelectUpload();

const contentId = ref<string | null>(null);

const dialogVisible = ref<boolean>(false);

watch(
  () => selectUploadError.value,
  (selectUploadError) => {
    if (selectUploadError.type === 'WrongFormat') {
      ElMessage.error(`请选择${selectUploadError.accepts}文件`);
    }
  }
);

onMounted(() => {
  contentId.value = props.thumbnailId;
});

const handleUpload = async () => {
  const imgFormat = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'];
  contentId.value = (await selectUploadExecute(imgFormat)) ?? null;
  emits('success', contentId.value);
};
const handlePreview = () => {
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
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
