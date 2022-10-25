<template>
  <ElTableColumn :label="config.label" :width="config.width" :fixed="config.fixed">
    <template #default="scope">
      <ElButton
        v-for="(action, actionIndex) in config.actions"
        v-show="display(action.display, scope.row) && !editState[scope.$index]"
        :key="actionIndex"
        class="action-btn"
        text
        type="primary"
        size="small"
        :icon="action.icon"
        @click="actionHandler(action, scope.row, scope.$index)"
        ><span v-html="formatter(action.text, scope.row)"></span
      ></ElButton>
      <ElButton
        v-show="editState[scope.$index]"
        class="action-btn"
        text
        type="primary"
        size="small"
        @click="save(scope.$index, config)"
        >保存</ElButton
      >
      <ElButton
        v-show="editState[scope.$index]"
        class="action-btn"
        text
        type="primary"
        size="small"
        @click="editState[scope.$index] = undefined"
        >取消</ElButton
      >
    </template>
  </ElTableColumn>
</template>

<script lang="ts" setup>
import { ElButton, elMessage, ElTableColumn } from '@edoms/design';

import { ColumnActionConfig, ColumnConfig } from './schema';

const props = withDefaults(
  defineProps<{
    columns: any[];
    config: ColumnConfig;
    rowkeyName?: string;
    editState?: any;
  }>(),
  {
    columns: () => [],
    config: () => ({}),
    rowkeyName: 'c_id',
    editState: () => [],
  }
);

const emit = defineEmits(['afterAction']);

const display = (fuc: boolean | Function | undefined, row: any) => {
  if (typeof fuc === 'function') {
    return fuc(row);
  }
  return true;
};

const formatter = (fuc: string | Function | undefined, row: any) => {
  if (typeof fuc === 'function') {
    return fuc(row);
  }
  return fuc;
};

const actionHandler = async (action: ColumnActionConfig, row: any, index: number) => {
  await action.before?.(row);
  if (action.type === 'edit') {
    props.editState[index] = row;
  } else {
    await action.handler?.(row);
  }
  action.after?.(row);
};

const save = async (index: number, config: ColumnConfig) => {
  const action = config.actions?.find((item) => item.type === 'edit')?.action;
  if (!action) return;

  const data: any = {};
  const row = props.editState[index];
  props.columns
    .filter((item) => item.type)
    .forEach((column) => {
      data[column.prop] = row[column.prop];
    });

  const res: any = await action({
    data,
  });

  if (res) {
    if (res.ret === 0) {
      elMessage.success('保存成功');
      props.editState[index] = undefined;
      emit('afterAction');
    } else {
      elMessage.error(res.msg || '保存失败');
    }
  } else {
    props.editState[index] = undefined;
    emit('afterAction');
  }
};
</script>
