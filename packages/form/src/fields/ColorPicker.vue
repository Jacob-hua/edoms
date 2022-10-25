<template>
  <ElColorPicker
    v-model="model[name]"
    :size="size"
    :disabled="disabled"
    :show-alpha="true"
    @change="changeHandler"
  ></ElColorPicker>
</template>

<script lang="ts" setup>
import { ElColorPicker } from '@edoms/design';

import { ColorPickConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: ColorPickConfig;
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

const changeHandler = (value: string) => emit('change', value);
</script>
