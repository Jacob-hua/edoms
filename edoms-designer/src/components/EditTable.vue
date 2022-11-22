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
  startEditable: (row: any) => void;
  deleteRow: (row: any) => void;
  cancelEditable: (row: any) => void;
  saveEditable: (row: any) => void;
}

export type EditingData = Set<any>;

export interface FormModel {
  data: any[];
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
  data: [],
});

const form = ref<any | null>(null);

const formProps = ref<FormProps>(new Set());

const editingData = ref<EditingData>(new Set());

watchEffect(() => {
  formModel.value.data = deepClone(data.value);
});

const startEditable = (row: any) => {
  const result = data.value.find((item) => item.id === row.id);
  editingData.value.add(result.id);
};

const deleteRow = (row: any) => {
  data.value = data.value.filter(({ id }) => id !== row.id);
};

const cancelEditable = (row: any) => {
  formModel.value.data = deepClone(data.value);
  editingData.value.delete(row.id);
};

const saveEditable = (row: any) => {
  if (!form.value) {
    return;
  }

  const index = data.value.findIndex(({ id }) => id === row.id);
  const validateFields = Array.from(formProps.value).map((prop) => `data.${index}.${prop}`);
  form.value.validateField &&
    form.value.validateField(validateFields, (validated: boolean) => {
      if (!validated) {
        return;
      }
      data.value.splice(index, 1, formModel.value.data[index]);
      cancelEditable(row);
    });
};

provide<Ref<FormModel>>('formModel', formModel);

provide<Ref<FormProps>>('formProps', formProps);

provide<Ref<EditingData>>('editingData', editingData);

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
