<template>
  <div class="appInfo">
    <el-form ref="formRef" :model="appInfo" :rules="rules" label-width="80px" class="demo-dynamic">
      <el-form-item label="名称" prop="name">
        <el-input v-model="appInfo.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input
          v-model="appInfo.description"
          type="textarea"
          placeholder="请输入应用简介内容"
          min="0"
          max="40"
          :rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="路径">
        <div class="path-box">
          <span class="prefix-path">http://xxxxxxxxx.xx/dssd/</span>
          <el-input v-model="appInfo.serviceAddress" placeholder="请输入路径"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="封面">
        <ImageUpload :thumbnail-id="appInfo.thumbnailId" @success="handleUploadSuccess"></ImageUpload>
      </el-form-item>
    </el-form>
    <div class="updateBtn" @click="update(appInfo)">更新</div>
  </div>
</template>

<script lang="ts" setup name="appInfo">
import { ref, toRefs } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import { updateApplication } from '@/api/application';
import { ApplicationInfo } from '@/api/application/type';
import { UpdateApplicationReq } from '@/api/application/type';
import ImageUpload from '@/components/ImageUpload.vue';

const emit = defineEmits<{
  (event: 'success'): void;
}>();
const props = defineProps<{
  appInfo: ApplicationInfo;
}>();
const rules = {
  name: [
    {
      required: true,
      message: '请输入应用名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '应用名称长度1-20字符',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: '请输入应用简介',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 40,
      message: '应用简介长度1-40字符',
      trigger: 'blur',
    },
  ],
  serviceAddress: [],
};
const { appInfo } = toRefs(props);

const formRef = ref<FormInstance>();

const handleUploadSuccess = (contentId: string | null) => {
  appInfo.value.thumbnailId = contentId ?? undefined;
};

const update = async ({ applicationId, name, description, thumbnailId, serviceAddress }: UpdateApplicationReq) => {
  if (!formRef.value) return;
  try {
    await formRef.value?.validate();
    await updateApplication({
      applicationId,
      name,
      description,
      thumbnailId,
      serviceAddress,
    });
    ElMessage.success('更新成功');
    emit('success');
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.preview-wrapper {
  :deep(.el-icon) {
    width: 1.5em !important;
    height: 1.5em !important;
    svg {
      width: 1.5em !important;
      height: 1.5em !important;
    }
  }
}
.modal {
  .el-image {
    width: 160px;
    height: 160px;
    .image-slot {
      img {
        width: 160px;
      }
    }
  }
}
.appInfo {
  width: 1000px;
  margin: auto;
  .path-box {
    display: flex;
    .prefix-path {
      padding: 0 10px;
      background-color: #e0e0e0;
    }
  }
  .updateBtn {
    color: #fff;
    width: 160px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 10px;
    background-color: #409eff;
    margin: auto;
    cursor: pointer;
  }
}
</style>
