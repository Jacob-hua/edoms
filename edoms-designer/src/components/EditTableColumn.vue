<template>
  <el-table-column :prop="prop" :label="label" :width="width">
    <template #default="scope">
      <el-form-item v-if="isEditing(scope.$index)" :prop="`model.${scope.$index}.data.${prop}`" :rules="rules">
        <slot
          name="edit"
          :$index="scope.$index"
          :row="getEditRow(scope.$index)"
          :column="scope.column"
          :actions="editActions"
        >
          {{ calculateColumnDefaultValue(scope) }}
        </slot>
      </el-form-item>
      <slot v-else :$index="scope.$index" :row="scope.row" :column="scope.column" :actions="editActions">
        {{ calculateColumnDefaultValue(scope) }}
      </slot>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { inject, Ref, watchEffect } from 'vue';

import { getByPath } from '@edoms/utils';

import { EditActions, FormModel, FormModelItem, FormProps } from './EditTable.vue';

export interface Rule {}

interface ColumnScope {
  row?: any;
  column: any;
  $index: number;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    prop?: string;
    label?: string;
    width?: string;
    rules?: Rule[];
  }>(),
  {
    prop: '',
    label: '',
  }
);

const editActions = inject<EditActions | undefined>('editActions');

const formModel = inject<Ref<FormModel | undefined>>('formModel');

const formProps = inject<Ref<FormProps | undefined>>('formProps');

watchEffect(() => {
  if (props.prop) {
    formProps?.value?.add(props.prop);
  }
});

const getEditModel = (index: number): FormModelItem => getByPath(formModel?.value ?? {}, `model.${index}`, {});

const getEditRow = (index: number): any => getEditModel(index).data;

const isEditing = (index: number): boolean => getEditModel(index).isEditing ?? false;

const calculateColumnDefaultValue = (scope: ColumnScope) => {
  return scope.row?.[props.prop];
};
</script>
