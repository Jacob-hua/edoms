<template>
  <el-dialog v-model="dialogVisible" :title="t('version.版本信息')" width="40%" centet>
    <el-form ref="formRef" :model="versionForm" :rules="formRules" label-width="142px" class="demo-dynamic">
      <el-form-item :label="t('version.版本名称')" prop="name">
        <el-input v-model="versionForm.name" :placeholder="t('version.rules.请输入版本名称')"></el-input>
      </el-form-item>
      <el-form-item :label="t('version.版本描述')" prop="description">
        <el-input
          v-model="versionForm.description"
          type="textarea"
          resize="none"
          :placeholder="t('version.rules.请输入版本描述内容')"
          min="0"
          max="20"
          :rows="6"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleFormCancle">{{ t('version.取消') }}</el-button>
        <el-button type="primary" @click="handleFormSubmit">{{ t('version.确认') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance } from 'element-plus';

import versionApi from '@/api/version';
export interface VersionItem {
  name: string;
  versionId: string;
  description: string;
}
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    visible: boolean;
    applicationId: string;
    applicationName: string;
    versionItem: VersionItem;
  }>(),
  {
    visible: () => false,
  }
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'success'): void;
}>();

const formRef = ref<FormInstance>();

const dialogVisible = computed<boolean>({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value);
  },
});

const versionForm = reactive({
  name: props.versionItem.name,
  versionId: props.versionItem.versionId,
  description: props.versionItem.description,
});

const formRules = {
  name: [
    { required: true, message: t('version.rules.请输入版本名称'), trigger: 'blur' },
    { min: 1, max: 10, message: t('version.rules.版本名称长度'), trigger: 'blur' },
    { whitespace: true, message: t('version.rules.版本名称不能为空'), trigger: 'blur' },
  ],
  description: [
    { required: true, message: t('version.rules.请输入版本描述内容'), trigger: 'blur' },
    { min: 1, max: 20, message: t('version.rules.版本描述长度'), trigger: 'blur' },
    { whitespace: true, message: t('version.rules.版本描述不能为空'), trigger: 'blur' },
  ],
};

const handleFormCancle = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();
    await versionApi.updateVersion({
      applicationId: props.applicationId,
      versionId: versionForm.versionId,
      name: versionForm.name,
      description: versionForm.description,
    });
    ElMessage.success(t('version.更新成功'));
    dialogVisible.value = false;
    emit('success');
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style></style>
