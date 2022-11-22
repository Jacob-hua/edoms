<template>
  <div>
    <el-form ref="form" :model="formModel">
      <el-table :data="data">
        <slot> </slot>
      </el-table>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { provide, Ref, ref, watchEffect } from 'vue';

import { deepClone } from '@edoms/utils';

export interface Pagination {
  pageSize: number;
  current: number;
}

export interface RequestResult<T> {
  data: T[];
  total: number;
}

export type RequestFunc<T> = (pagination: Pagination) => Promise<RequestResult<T>> | RequestResult<T>;

export interface EditTableProvide {}

export interface EditActions {
  startEditable: (index: number) => void;
  deleteRow: (index: number) => void;
  cancelEditable: (index: number) => void;
  saveEditable: (index: number) => void;
}

export interface FormModelItem {
  isEditing: boolean;
  data: Record<string | number | symbol, any>;
}

export interface FormModel {
  model: FormModelItem[];
}

export type FormProps = Set<string>;

const props = withDefaults(
  defineProps<{
    dataSource?: any[];
    request?: RequestFunc<any>;
  }>(),
  {
    dataSource: () => [],
    request: () => ({
      data: [],
      total: 0,
    }),
  }
);

const data = ref<any[]>(props.dataSource);

const formModel = ref<FormModel>({
  model: [],
});

const form = ref<any | null>(null);

const formProps = ref<FormProps>(new Set());

watchEffect(() => {
  formModel.value.model = deepClone(data.value).map((row: any, index: number): FormModelItem => {
    if (!formModel.value.model[index]) {
      return { data: { ...row }, isEditing: false };
    }
    const formModelItem = formModel.value.model[index];
    return formModelItem;
  });
});

const startEditable = (index: number) => {
  formModel.value.model[index].isEditing = true;
};

const deleteRow = (index: number) => {
  data.value = data.value.splice(index, 1);
};

const cancelEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  const validateFields = Array.from(formProps.value).map((prop) => `model.${index}.data.${prop}`);
  form.value.resetFields && form.value.resetFields(validateFields);
  formModel.value.model[index].isEditing = false;
};

const saveEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  const validateFields = Array.from(formProps.value).map((prop) => `model.${index}.data.${prop}`);
  form.value.validateField &&
    form.value.validateField(validateFields, (validated: boolean) => {
      if (!validated) {
        return;
      }
      const formModelItem = formModel.value.model[index];
      data.value.splice(index, 1, formModelItem.data);
      formModelItem.isEditing = false;
    });
};

provide<Ref<FormModel>>('formModel', formModel);

provide<Ref<FormProps>>('formProps', formProps);

provide<EditActions>('editActions', {
  startEditable,
  deleteRow,
  cancelEditable,
  saveEditable,
});

defineExpose({
  data,
});
</script>
