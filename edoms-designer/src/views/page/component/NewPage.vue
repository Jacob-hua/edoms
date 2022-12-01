<template>
  <el-dialog v-model="newPageVisible" title="新增页面" width="30%" @close="handleClose">
    <span>
      <el-form ref="form" :model="page" :rules="rules">
        <el-form-item label="应用页名称" prop="name">
          <el-input v-model="page.name" clearable></el-input>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newPageVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, FormInstance } from 'element-plus';

import { createPage } from '@/api/page';

const route = useRoute();
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'success'): void;
}>();

const newPageVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      form.value?.resetFields();
    }
    emit('update:visible', value);
  },
});

const form = ref<FormInstance>();
const page = ref({
  name: '',
});
const rules = {
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
    await createPage({
      name: page.value?.name,
      applicationId: route.query.applicationId as string,
    });
    ElMessage.success('页面创建成功');
    newPageVisible.value = false;
    emit('success');
  } catch (e) {
    console.log(e);
  }
};
</script>

<style></style>
