<template>
  <div class="new-wrapper">
    <el-dialog v-model="dialogVisible" :title="$t('application.newApplication')" width="40%" center>
      <el-form ref="formRef" :model="applicationForm" :rules="formRules" label-width="80px" class="demo-dynamic">
        <el-form-item :label="$t('application.applicationName')" prop="name">
          <el-input v-model="applicationForm.name" :placeholder="$t('application.rules.inputName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('application.introduction')" prop="description">
          <el-input
            v-model="applicationForm.description"
            type="textarea"
            resize="none"
            :placeholder="$t('application.rules.inputIntroduction')"
            min="0"
            max="40"
            :rows="6"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('application.cover')" prop="thumbnailId">
          <ImageUpload @success="success"></ImageUpload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleFormCancel">{{ $t('application.cancel') }}</el-button>
          <el-button type="primary" @click="handleFormSubmit">{{ $t('application.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="newApp">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance } from 'element-plus';

import applicationApi, { CreateApplicationReq } from '@/api/application';
import versionApi from '@/api/version';
import ImageUpload from '@/components/ImageUpload.vue';
import useUploadDefaultDSL from '@/hooks/useUploadDefaultDSL';
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: () => false,
  }
);

const emit = defineEmits<{
  (event: 'update:visible', data: boolean): void;
  (event: 'submitted'): void;
}>();

const formRef = ref<FormInstance>();

const dialogVisible = computed<boolean>({
  get: () => props.visible,
  set: (visible) => {
    if (!visible) {
      formRef.value?.resetFields();
    }
    emit('update:visible', visible);
  },
});

const applicationForm = reactive<CreateApplicationReq>({
  name: '',
  description: '',
  thumbnailId: '',
});

const formRules = {
  name: [
    { required: true, message: t('application.rules.inputName'), trigger: 'blur' },
    { min: 1, max: 20, message: t('application.rules.applicationLimit'), trigger: 'blur' },
    { whitespace: true, message: t('application.rules.noName'), trigger: 'blur' },
  ],
  description: [
    { required: true, message: t('application.rules.inputIntroduction'), trigger: 'blur' },
    { min: 1, max: 40, message: t('application.rules.introductionLimit'), trigger: 'blur' },
    { whitespace: true, message: t('application.rules.noIntroduction'), trigger: 'blur' },
  ],
};

const success = (contentId: string) => {
  applicationForm.thumbnailId = contentId;
};
const handleFormCancel = () => {
  dialogVisible.value = false;
};

const { execute: uploadDefaultDSLExecute } = useUploadDefaultDSL();

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value?.validate();
    // 提交表单操作
    const { applicationId, versionId } = await applicationApi.createApplication(applicationForm);
    const contentId = await uploadDefaultDSLExecute(applicationId, applicationForm.name);
    await versionApi.updateContent({
      applicationId,
      versionId: versionId,
      contentId,
    });
    ElMessage.success(t('application.success'));
    dialogVisible.value = false;
    dialogVisible.value = false;
    emit('submitted');
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style scoped lang="scss">
.new-wrapper {
  :deep(.el-icon) {
    width: 1.5em !important;
    height: 1.5em !important;
    svg {
      width: 1.5em !important;
      height: 1.5em !important;
    }
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.demo-dynamic {
  padding-right: 40px;
}
</style>
