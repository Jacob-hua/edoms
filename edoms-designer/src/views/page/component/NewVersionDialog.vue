<template>
  <el-dialog v-model="dialogVisible" :title="t('page.built')" width="30%">
    <span>
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
        <el-form-item :label="t('page.versionName')" prop="name">
          <el-input v-model="formModel.name" clearable :placeholder="t('page.input')"></el-input>
        </el-form-item>
        <el-form-item :label="t('page.description')" prop="description">
          <el-input
            v-model="formModel.description"
            clearable
            :placeholder="t('page.inputdes')"
            type="textarea"
            resize="none"
            min="0"
            max="40"
            :rows="6"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('page.source')" prop="createFrom">
          <SwitchVersion v-if="dialogVisible" v-model="formModel.createFrom" :application-id="applicationId">
          </SwitchVersion>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">{{ t('page.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm"> {{ t('page.confirm') }} </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance, FormRules } from 'element-plus';

import versionApi from '@/api/version';
import useUploadDefaultDSL from '@/hooks/useUploadDefaultDSL';

import SwitchVersion, { VersionModel } from './SwitchVersion.vue';
const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  applicationId: string;
  applicationName: string;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'success'): void;
  (event: 'error', value: any): void;
}>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      formRef.value?.resetFields();
    }
    emit('update:visible', value);
  },
});

const formRef = ref<FormInstance>();

const formModel = reactive({
  applicationId: props.applicationId,
  name: '',
  description: '',
  createFrom: {
    name: '',
    versionId: '',
    contentId: '',
  } as VersionModel,
});

const formRules: FormRules = {
  name: [
    {
      required: true,
      whitespace: true,
      message: t('page.rules.noName'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 10,
      message: t('page.rules.nameLimit'),
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      whitespace: true,
      message: t('page.rules.noDes'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: t('page.rules.desLimit'),
    },
  ],
};

const { execute: uploadDefaultDSLExecute } = useUploadDefaultDSL();

const handleConfirm = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value?.validate();
    const { name, description, createFrom } = formModel;
    let contentId = createFrom.contentId;
    if (!createFrom.contentId) {
      contentId = await uploadDefaultDSLExecute(props.applicationId, props.applicationName);
    }
    await versionApi.saveVersion({
      applicationId: props.applicationId,
      name,
      description,
      contentId,
    });
    ElMessage.success(t('page.success'));
    dialogVisible.value = false;
    emit('success');
  } catch (e) {
    emit('error', e);
  }
};
</script>

<style lang="scss" scoped></style>
