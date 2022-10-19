<!-- eslint-disable vue/no-undef-properties -->
<template>
  <div v-if="model">
    <el-color-picker
      v-model="model[name]"
      :size="size"
      :disabled="disabled"
      :show-alpha="true"
      @change="changeHandler"
    ></el-color-picker>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ColorPickConfig } from '../schema';
import fieldProps from '../utils/fieldProps';
import { useAddField } from '../utils/useAddField';
export default defineComponent({
  name: 'MFieldsColorPicker',
});
</script>

<script lang="ts" setup>
const emit = defineEmits(['change']);

const props = defineProps({
  ...fieldProps,
  // eslint-disable-next-line vue/no-unused-properties
  config: {
    type: Object as PropType<ColorPickConfig>,
    required: true,
  },
});

// eslint-disable-next-line vue/no-undef-properties
useAddField(props.prop);

const changeHandler = (value: string) => emit('change', value);
</script>
