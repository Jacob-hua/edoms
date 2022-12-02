<template>
  <div class="page-wrapper">
    <el-dialog v-model="versionVisible" title="保存为版本" width="30%">
      <span>
        <el-form ref="versionForm" :model="version" :rules="versionRules">
          <el-form-item label="版本名称" prop="name">
            <el-input v-model="version.name" clearable></el-input>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="versionVisible = false">取消</el-button>
          <el-button type="primary" @click="handleVersionConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import { saveWithVersion } from '@/api/version';

const props = defineProps<{
  visible: boolean;
  active: any;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const versionForm = ref<FormInstance>();

const versionVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      versionForm.value?.resetFields();
    }
    emit('update:visible', value);
  },
});

const version = ref({
  name: '',
});
const versionRules = {
  name: [
    {
      required: true,
      message: '请输入版本名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '版本名称长度1-20字符',
      trigger: 'blur',
    },
  ],
};

const handleVersionConfirm = async () => {
  if (!versionForm.value) return;
  try {
    await versionForm.value?.validate();
    await saveWithVersion({
      pageId: props.active.pageId,
      contentId: props.active.pushContentId,
      name: version.value.name,
      description: props.active.description,
    });
    ElMessage.success('保存版本成功');
    versionVisible.value = false;
  } catch (e) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  :deep(.el-icon) {
    width: 1.5em !important;
    height: 1.5em !important;
    svg {
      width: 1.5em !important;
      height: 1.5em !important;
    }
  }
}
</style>
