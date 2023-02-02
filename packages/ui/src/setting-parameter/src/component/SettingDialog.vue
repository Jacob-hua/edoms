<template>
  <div>
    <el-dialog v-model="dialogVisible" width="40%" title="设定参数">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
        <el-form-item label="参数名称" prop="propName">
          <el-input v-model="formModel.propName" disabled></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="propValue">
          <el-input v-model="formModel.propValue"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="propUnit">
          <el-input v-model="formModel.propUnit" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleFormCancle">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { FormInstance, FormRules } from 'element-plus';

import { Parameter } from '../type';

const props = withDefaults(
  defineProps<{
    parameterData: Parameter;
    visible: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'submitParameter', value: Parameter): void;
}>();

const formRef = ref<FormInstance>();
const formModel = ref<Parameter>({
  propName: props.parameterData.propName,
  propValue: props.parameterData.propValue,
  propUnit: props.parameterData.propUnit,
});

watch(
  () => props.parameterData,
  (val) => {
    formModel.value = val;
  },
  {
    immediate: true,
    deep: true,
  }
);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    if (!value) {
      formRef.value?.resetFields();
    }
    emit('update:visible', value);
  },
});

const formRules: FormRules = {
  propName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
  propValue: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
  propUnit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
};

const handleFormCancle = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};
const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit('submitParameter', formModel.value);
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
$bgColor: #000000;
$textColor: #ffffff85;

:deep(.el-dialog__header) {
  background-color: rgba(31, 30, 29, 1);
  margin: 0;
}

:deep(.el-dialog__header span) {
  color: $textColor;
}

:deep(.el-dialog__body) {
  background-color: $bgColor;
}

:deep(.el-dialog__footer) {
  background-color: $bgColor;
}

:deep(.el-input__wrapper) {
  background-color: $bgColor;
  box-shadow: 0 0 0 1px $textColor;
}

:deep(.el-input__inner) {
  color: $textColor;
}

:deep(.el-button) {
  background: $bgColor;
  color: $textColor;
  border-color: $textColor;
}

:deep(.el-button--primary) {
  background: #409eff;
  color: #ffffff;
  border-color: #409eff;
}

:deep(.el-form-item__label) {
  color: $textColor;
}
</style>
