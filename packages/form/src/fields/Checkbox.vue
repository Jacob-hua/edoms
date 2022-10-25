<template>
  <ElCheckbox
    v-model="model[name]"
    :size="size"
    :true-label="activeValue"
    :false-label="inactiveValue"
    :disabled="disabled"
    @change="changeHandler"
    >{{ config.text }}</ElCheckbox
  >
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { ElCheckbox } from '@edoms/design';

import { CheckboxConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: CheckboxConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size: 'mini' | 'small' | 'medium';
}>();

const emit = defineEmits(['change']);

useAddField(props.prop);

const activeValue = computed(() => {
  if (typeof props.config.activeValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 1;
    }
  } else {
    return props.config.activeValue;
  }

  return undefined;
});

const inactiveValue = computed(() => {
  if (typeof props.config.inactiveValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 0;
    }
  } else {
    return props.config.inactiveValue;
  }

  return undefined;
});

const changeHandler = (value: number | boolean) => {
  emit('change', value);
};
</script>
