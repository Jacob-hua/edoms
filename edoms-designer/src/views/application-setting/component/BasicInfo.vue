<template>
  <div class="appInfo">
    <el-form
      ref="formRef"
      :disabled="isDisabledForm"
      :model="appInfo"
      :rules="formRules"
      label-width="80px"
      class="demo-dynamic"
    >
      <el-form-item :label="t('applicationSetting.名称')" prop="name">
        <el-input v-model="appInfo.name" :placeholder="t('applicationSetting.rules.请输入应用名称')"></el-input>
      </el-form-item>
      <el-form-item :label="t('applicationSetting.简介')" prop="description">
        <el-input
          v-model="appInfo.description"
          type="textarea"
          :placeholder="t('applicationSetting.rules.请输入应用简介内容')"
          resize="none"
          min="0"
          max="40"
          :rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('applicationSetting.预览')" prop="serviceAddress">
        <el-input v-model="appInfo.serviceAddress" :placeholder="t('applicationSetting.rules.请输入路径')">
          <template #prepend>{{ previewPath }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="t('applicationSetting.封面')">
        <ImageUpload :thumbnail-id="appInfo.thumbnailId" @success="handleUploadSuccess"></ImageUpload>
      </el-form-item>
    </el-form>
    <div v-permission="ApplicationPermission.APPLICATION_DESIGN_UPDATE" class="updateBtn" @click="update(appInfo)">
      {{ t('applicationSetting.更新') }}
    </div>
  </div>
</template>

<script lang="ts" setup name="appInfo">
import { ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance } from 'element-plus';

import applicationApi, { GetApplicationRes, UpdateApplicationReq } from '@/api/application';
import ImageUpload from '@/components/ImageUpload.vue';
import { ApplicationPermission } from '@/const/permission';
import usePermissionStore from '@/store/permission';
const { t } = useI18n();
const props = defineProps<{
  appInfo: GetApplicationRes;
}>();

const emit = defineEmits<{
  (event: 'success'): void;
}>();
const { hasPermission } = usePermissionStore();
const isDisabledForm = !hasPermission(ApplicationPermission.APPLICATION_DESIGN_UPDATE);
const previewPath = import.meta.env.VITE_PREVIEW_PATH;
const formRules = {
  name: [
    {
      required: true,
      whitespace: true,
      message: t('applicationSetting.rules.应用名称不能为空'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: t('applicationSetting.rules.应用名称长度'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      whitespace: true,
      message: t('applicationSetting.rules.应用简介不能为空'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 40,
      message: t('applicationSetting.rules.应用简介长度'),
      trigger: 'blur',
    },
  ],
  serviceAddress: [
    {
      required: true,
      whitespace: true,
      message: t('applicationSetting.rules.发布路径不能为空'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: t('applicationSetting.rules.发布路径长度'),
      trigger: 'blur',
    },
    {
      pattern: /^[0-9a-zA-Z]+$/,
      message: t('applicationSetting.rules.发布路径只能是数字和字母'),
      trigger: 'blur',
    },
  ],
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
    await applicationApi.updateApplication({
      applicationId,
      name,
      description,
      thumbnailId,
      serviceAddress,
    });
    ElMessage.success(t('applicationSetting.更新成功'));
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
