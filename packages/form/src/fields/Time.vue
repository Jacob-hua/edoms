<!-- eslint-disable vue/no-undef-properties -->
<template>
  <el-time-picker
    v-model="model[name]"
    :size="size"
    value-format="HH:mm:ss"
    :placeholder="config.placeholder"
    :disabled="disabled"
    @change="changeHandler"
  ></el-time-picker>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { TimeConfig } from '../schema';
import fieldProps from '../utils/fieldProps';
import { useAddField } from '../utils/useAddField';

export default defineComponent({
  name: 'MFieldsTime',
  expose: [],
  props: {
    ...fieldProps,
    config: {
      type: Object as PropType<TimeConfig>,
      required: true,
    },
  },

  emits: {
    change(values: Date) {
      return values;
    },
  },

  setup(props, { emit }) {
    // eslint-disable-next-line vue/no-undef-properties
    useAddField(props.prop);

    return {
      changeHandler: (v: Date) => {
        emit('change', v);
      },
    };
  },
});
</script>
