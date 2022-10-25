<template>
  <ElRadioGroup v-if="model" v-model="model[name]" :size="size" :disabled="disabled" @change="changeHandler">
    <ElRadio v-for="option in config.options" :key="`${option.value}`" :label="option.value">{{ option.text }}</ElRadio>
  </ElRadioGroup>
</template>

<script lang="ts" setup>
import { ElRadio, ElRadioGroup } from '@edoms/design';

import { RadioGroupConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: RadioGroupConfig;
  model: any;
  initValues?: any;
  values?: any;
  name: string;
  prop: string;
  disabled?: boolean;
  size: 'mini' | 'small' | 'medium';
}>();

const emit = defineEmits(['change']);

const changeHandler = (value: number) => {
  emit('change', value);
};

useAddField(props.prop);
</script>
