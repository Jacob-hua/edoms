<template>
  <div>
    <el-form ref="form" :model="formModel">
      <el-table :data="formModel.data">
        <slot> </slot>
      </el-table>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, Ref, ref } from 'vue';

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

export type EditingData = Map<any, any>;

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

const formModel = reactive({
  data: props.dataSource,
});

const form = ref<any | null>(null);

const formProps = ref<FormProps>(new Set());

const editingData = ref<EditingData>(new Map());

const startEditable = (row: any) => {
  const result = formModel.data.find((item) => item.id === row.id);
  editingData.value.set(row.id, result);
};

const deleteRow = (row: any) => {
  formModel.data = formModel.data.filter(({ id }) => id !== row.id);
};

const cancelEditable = (row: any) => {
  editingData.value.delete(row.id);
};

const saveEditable = (row: any) => {
  if (!form.value) {
    return;
  }

  const index = formModel.data.findIndex(({ id }) => id === row.id);
  const validateFields = Array.from(formProps.value).map((prop) => `data.${index}.${prop}`);
  form.value.validateField &&
    form.value.validateField(validateFields, (validated: boolean) => {
      if (!validated) {
        return;
      }
      cancelEditable(row);
    });
};

provide<Ref<FormProps>>('formProps', formProps);

provide<Ref<EditingData>>('editingData', editingData);

provide<EditActions>('editActions', {
  startEditable,
  deleteRow,
  cancelEditable,
  saveEditable,
});
</script>
