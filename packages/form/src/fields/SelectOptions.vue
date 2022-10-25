<template>
  <ElOption
    v-for="option in options"
    :key="valueKey ? option.value[valueKey] : option.value"
    :label="option.text"
    :value="option.value"
    :disabled="option.disabled"
  ></ElOption>
</template>

<script lang="ts" setup>
import { ElOption } from '@edoms/design';

import { SelectOption } from '../schema';

defineProps<{
  options: SelectOption[];
  valueKey?: string;
}>();
</script>
