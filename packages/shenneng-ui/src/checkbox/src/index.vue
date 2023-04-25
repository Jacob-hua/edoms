<template>
  <el-checkbox-group v-model="selectedValue" @change="handleSelectedChange">
    <el-checkbox
      v-for="({ value, label, disabled }, index) in config.options"
      :key="index"
      :disabled="disabled"
      :label="value"
      >{{ label }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import useApp from '../../useApp';

import { MCheckbox } from './type';

const props = defineProps<{
  config: MCheckbox;
}>();

const { provideMethod, app } = useApp(props);

const node = app?.page?.getNode(props.config.id);

const selectedValue = ref<string[]>([]);

const setSelectedValue = provideMethod(
  'setSelectedValue',
  ({ value }) => {
    selectedValue.value = value;
  },
  ['value']
);

watch(
  () => props.config.options,
  (options) => {
    if (!options) {
      return;
    }
    setSelectedValue({
      value: options.filter(({ selected }) => selected).map(({ value }) => value),
    });
  },
  { immediate: true }
);

const handleSelectedChange = () => {
  app?.emit('checkbox:change', node, selectedValue.value);
};
</script>

<style lang="scss" scoped>
:deep(.el-checkbox) {
  --el-checkbox-checked-bg-color: rgb(5, 104, 253);
  font-size: inherit;
  color: inherit;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: inherit;
}
:deep(.el-checkbox__inner) {
  display: inline-block;
  position: relative;
  border: var(--el-checkbox-input-border);
  border-radius: var(--el-checkbox-border-radius);
  box-sizing: border-box;
  width: var(--el-checkbox-input-width);
  height: var(--el-checkbox-input-height);
  background-color: var(--el-checkbox-bg-color);
  z-index: inherit;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), outline 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
:deep(.el-checkbox__label) {
  font-size: inherit;
  color: inherit;
}
</style>
