<template>
  <el-dialog v-model="dialogVisible" title="新增页面" width="30%">
    <span>
      <el-form ref="form" :model="formModel" :rules="formRules">
        <el-form-item label="应用页名称" prop="name">
          <el-input v-model="formModel.name" clearable></el-input>
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
import { computed, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import pageApi from '@/api/page';

const props = defineProps<{
  visible: boolean;
  applicationId: string;
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
      form.value?.resetFields();
    }
    emit('update:visible', value);
  },
});

const form = ref<FormInstance>();

const formModel = ref({
  applicationId: props.applicationId,
  name: '',
});

const formRules = {
  name: [
    {
      required: true,
      message: '请输入页面名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 10,
      message: '页面名称长度1-10字符',
      trigger: 'blur',
    },
  ],
};

const handleConfirm = async () => {
  if (!form.value) return;
  try {
    await form.value?.validate();
    await pageApi.createPage({
      ...formModel.value,
    });
    ElMessage.success('页面创建成功');
    dialogVisible.value = false;
    emit('success');
  } catch (e) {
    emit('error', e);
  }
};
</script>

<style></style>
