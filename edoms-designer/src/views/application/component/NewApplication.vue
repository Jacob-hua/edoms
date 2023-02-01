<template>
  <div class="new-wrapper">
    <el-dialog v-model="dialogVisible" title="新建应用" width="40%" center>
      <el-form ref="formRef" :model="applicationForm" :rules="formRules" label-width="80px" class="demo-dynamic">
        <el-form-item label="名称" prop="name">
          <el-input v-model="applicationForm.name" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="applicationForm.description"
            type="textarea"
            resize="none"
            placeholder="请输入应用简介内容"
            min="0"
            max="40"
            :rows="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="thumbnailId">
          <ImageUpload @success="success"></ImageUpload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleFormCancel">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="newApp">
import { computed, reactive, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import applicationApi, { CreateApplicationReq } from '@/api/application';
import versionApi from '@/api/version';
import ImageUpload from '@/components/ImageUpload.vue';
import useUploadDefaultDSL from '@/hooks/useUploadDefaultDSL';

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
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 1, max: 20, message: '应用名称长度1-20字符', trigger: 'blur' },
    { whitespace: true, message: '应用名称不能为空', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入应用简介', trigger: 'blur' },
    { min: 1, max: 40, message: '应用简介长度1-40字符', trigger: 'blur' },
    { whitespace: true, message: '应用简介不能为空', trigger: 'blur' },
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
    ElMessage.success('创建成功');
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
