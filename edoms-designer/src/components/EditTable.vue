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
import { computed, onMounted, provide, Ref, ref, watchEffect } from 'vue';

import { deepClone } from '@edoms/utils';

export type RequestResult<T> = T[];

export type RequestFunc<T> = () => Promise<RequestResult<T>> | RequestResult<T>;

export interface EditTableProvide {}

export interface EditActions {
  addRow: (row?: Record<any, any>) => void;
  deleteRow: (index: number) => void;
  startEditable: (index: number) => void;
  cancelEditable: (index: number) => void;
  saveEditable: (index: number) => void;
}

export interface FormModelItem {
  isEditing: boolean;
  isNew: boolean;
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
    request: () => [],
  }
);

const data = ref<any[]>(props.dataSource);

const formModel = ref<FormModel>({
  model: data.value,
});

const form = ref<any | null>(null);

const formProps = ref<FormProps>(new Set());

const resultData = computed(() => {
  const newIndexes = formModel.value.model.reduce((newIndexes: Set<number>, model: FormModelItem, index: number) => {
    if (model.isNew) {
      newIndexes.add(index);
    }
    return newIndexes;
  }, new Set<number>());
  return data.value.filter((_: any, index: number) => !newIndexes.has(index));
});

const synchronizeFormModel = (data: any[], isInit: boolean = false) => {
  formModel.value.model = deepClone(data).map((row: any, index: number): FormModelItem => {
    if (index >= formModel.value.model.length) {
      return { data: { ...row }, isEditing: !isInit, isNew: !isInit };
    }
    const formModelItem = formModel.value.model[index];
    return formModelItem;
  });
};

watchEffect(() => {
  synchronizeFormModel(data.value);
});

onMounted(async () => {
  const result = await Promise.resolve(props.request());
  synchronizeFormModel([...data.value, ...result], true);
  data.value.push(...result);
});

const generateValidateFields = (index: number) =>
  Array.from(formProps.value).map((prop) => `model.${index}.data.${prop}`);

const startEditable = (index: number) => {
  formModel.value.model[index].isEditing = true;
};

const deleteRow = (index: number) => {
  data.value = data.value.splice(index, 1);
};

const addRow = (row: Record<any, any> = {}) => {
  data.value.push(row);
};

const cancelEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  form.value.resetFields && form.value.resetFields(generateValidateFields(index));
  const formModelItem = formModel.value.model[index];
  if (formModelItem.isNew) {
    data.value.splice(index, 1);
  } else {
    formModelItem.isEditing = false;
  }
};

const saveEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  form.value.validateField &&
    form.value.validateField(generateValidateFields(index), (validated: boolean) => {
      if (!validated) {
        return;
      }
      const formModelItem = formModel.value.model[index];
      data.value.splice(index, 1, formModelItem.data);
      formModelItem.isEditing = false;
      formModelItem.isNew = false;
    });
};

const editActions: EditActions = {
  addRow,
  deleteRow,
  startEditable,
  cancelEditable,
  saveEditable,
};

provide<Ref<FormModel>>('formModel', formModel);

provide<Ref<FormProps>>('formProps', formProps);

provide<EditActions>('editActions', editActions);

defineExpose({
  resultData,
  editActions,
});
</script>
