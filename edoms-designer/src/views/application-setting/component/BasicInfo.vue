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
      <el-form-item :label="$t('applicationSetting.applicationName')" prop="name">
        <el-input v-model="appInfo.name" :placeholder="$t('applicationSetting.rules.inputName')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('applicationSetting.introduction')" prop="description">
        <el-input
          v-model="appInfo.description"
          type="textarea"
          :placeholder="$t('applicationSetting.rules.inputIntroduction')"
          resize="none"
          min="0"
          max="40"
          :rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('applicationSetting.preview')" prop="serviceAddress">
        <el-input v-model="appInfo.serviceAddress" :placeholder="$t('applicationSetting.rules.inputPath')">
          <template #prepend>{{ previewPath }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('applicationSetting.cover')">
        <ImageUpload :thumbnail-id="appInfo.thumbnailId" @success="handleUploadSuccess"></ImageUpload>
      </el-form-item>
    </el-form>
    <div v-permission="ApplicationPermission.APPLICATION_DESIGN_UPDATE" class="updateBtn" @click="update(appInfo)">
      {{ $t('applicationSetting.update') }}
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
      message: t('applicationSetting.rules.noName'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: t('applicationSetting.rules.applicationLimit'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      whitespace: true,
      message: t('applicationSetting.rules.noIntroduction'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 40,
      message: t('applicationSetting.rules.introductionLimit'),
      trigger: 'blur',
    },
  ],
  serviceAddress: [
    {
      required: true,
      whitespace: true,
      message: t('applicationSetting.rules.noPath'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: t('applicationSetting.rules.pathLimit'),
      trigger: 'blur',
    },
    {
      pattern: /^[0-9a-zA-Z]+$/,
      message: t('applicationSetting.rules.pathRules'),
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
    ElMessage.success(t('applicationSetting.success'));
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
