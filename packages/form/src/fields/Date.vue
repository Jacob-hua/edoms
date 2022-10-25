<template>
  <ElDatePicker
    v-model="model[name]"
    type="date"
    :size="size"
    :placeholder="config.placeholder"
    :disabled="disabled"
    :format="config.format"
    :value-format="config.format || 'YYYY-MM-DD HH:mm:ss'"
    @change="changeHandler"
  ></ElDatePicker>
</template>

<script lang="ts" setup>
import { ElDatePicker } from '@edoms/design';
import { dateFormat } from '@edoms/utils';

import { DateConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: DateConfig;
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

props.model[props.name] = dateFormat(props.model[props.name], '');

const changeHandler = (v: string) => {
  emit('change', v);
};
</script>
