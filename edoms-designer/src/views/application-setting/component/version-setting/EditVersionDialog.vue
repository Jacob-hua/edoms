<template>
  <el-dialog v-model="dialogVisible" title="版本信息" width="40%" centet>
    <el-form ref="formRef" :model="versionForm" :rules="formRules" label-width="80px" class="demo-dynamic">
      <el-form-item label="版本名称" prop="name">
        <el-input v-model="versionForm.name" placeholder="请输入版本名称"></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="description">
        <el-input
          v-model="versionForm.description"
          type="textarea"
          resize="none"
          placeholder="请输入版本描述内容"
          min="0"
          max="20"
          :rows="6"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleFormCancle">取消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import versionApi from '@/api/version';

export interface VersionItem {
  name: string;
  versionId: string;
  description: string;
}

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
    { required: true, message: '请输入版本名称', trigger: 'blur' },
    { min: 1, max: 10, message: '版本名称长度1-10字符', trigger: 'blur' },
    { whitespace: true, message: '版本名称不能为空', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入版本描述', trigger: 'blur' },
    { min: 1, max: 20, message: '版本描述长度1-20字符', trigger: 'blur' },
    { whitespace: true, message: '版本描述不能为空', trigger: 'blur' },
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
    ElMessage.success('更新成功');
    dialogVisible.value = false;
    emit('success');
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style></style>
