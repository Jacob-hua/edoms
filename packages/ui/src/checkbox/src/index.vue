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
