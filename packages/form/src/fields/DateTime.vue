<template>
  <ElDatePicker
    v-model="model[name]"
    popper-class="edoms-datetime-picker-popper"
    type="datetime"
    :size="size"
    :placeholder="config.placeholder"
    :disabled="disabled"
    :format="config.format || 'YYYY-MM-DD HH:mm:ss'"
    :value-format="config.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
    :default-time="config.defaultTime"
    @change="changeHandler"
  ></ElDatePicker>
</template>

<script lang="ts" setup>
import { ElDatePicker } from '@edoms/design';
import { dateFormat } from '@edoms/utils';

import { DateTimeConfig } from '../schema';
import { useAddField } from '../utils/useAddField';

const props = defineProps<{
  config: DateTimeConfig;
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

const value = props.model?.[props.name].toString();
if (props.model) {
  if (value === 'Invalid Date') {
    props.model[props.name] = '';
  } else {
    props.model[props.name] = dateFormat(props.model[props.name], '', props.config.valueFormat);
  }
}

const changeHandler = (v: string) => {
  emit('change', v);
};
</script>
