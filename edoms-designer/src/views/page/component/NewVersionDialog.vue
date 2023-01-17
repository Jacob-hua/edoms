<template>
  <el-dialog v-model="dialogVisible" title="新建版本" width="30%">
    <span>
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="formModel.name" clearable placeholder="请输入版本名称"></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <el-input
            v-model="formModel.description"
            clearable
            placeholder="请输入版本简介"
            type="textarea"
            resize="none"
            min="0"
            max="40"
            :rows="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本来源" prop="createFrom">
          <SwitchVersion v-if="dialogVisible" v-model="formModel.createFrom" :application-id="applicationId">
          </SwitchVersion>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import serialize from 'serialize-javascript';

import versionApi from '@/api/version';
import useUpload from '@/hooks/useUpload';
import { generateDefaultDSL } from '@/util/dsl';

import SwitchVersion, { VersionModel } from './SwitchVersion.vue';

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
      message: '版本名称不能为空',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 10,
      message: '版本名称字符长度在1-10之间',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      whitespace: true,
      message: '版本描述不能为空',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '版本描述字符长度在1-20之间',
    },
  ],
};

const handleConfirm = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value?.validate();
    const { name, description, createFrom } = formModel;
    let contentId = createFrom.contentId;
    if (!createFrom.contentId) {
      contentId = await uploadDefaultDsl();
    }
    await versionApi.saveVersion({
      applicationId: props.applicationId,
      name,
      description,
      contentId,
    });
    ElMessage.success('版本创建成功');
    dialogVisible.value = false;
    emit('success');
  } catch (e) {
    emit('error', e);
  }
};

const { execute: uploadExecute } = useUpload();

async function uploadDefaultDsl(): Promise<string> {
  const dsl = generateDefaultDSL({ applicationId: props.applicationId, applicationName: props.applicationName });
  const DSL = serialize(dsl, {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');

  return await uploadExecute(DSL, `dsl.js`, 'text/javascript', 'utf-8');
}
</script>

<style lang="scss" scoped></style>
