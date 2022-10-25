<template>
  <ElSwitch
    v-model="model[name]"
    :size="size"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :disabled="disabled"
    @change="changeHandler"
  ></ElSwitch>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { ElSwitch } from '@edoms/design';

import { SwitchConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: SwitchConfig;
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

const changeHandler = (value: number) => {
  emit('change', value);
};

const activeValue = computed(() => {
  if (typeof props.config.activeValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 1;
    }
  } else {
    return props.config.activeValue;
  }

  return true;
});

const inactiveValue = computed(() => {
  if (typeof props.config.inactiveValue === 'undefined') {
    if (props.config.filter === 'number') {
      return 0;
    }
  } else {
    return props.config.inactiveValue;
  }

  return false;
});
</script>
