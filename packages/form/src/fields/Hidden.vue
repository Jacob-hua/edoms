<!-- eslint-disable vue/no-undef-properties -->
<template>
  <input v-if="model" v-model="model[n]" type="hidden" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { HiddenConfig } from '../schema';
import fieldProps from '../utils/fieldProps';
import { useAddField } from '../utils/useAddField';

export default defineComponent({
  name: 'MFieldsHidden',
});
</script>

<script setup lang="ts">
const props = defineProps({
  ...fieldProps,
  config: {
    type: Object as PropType<HiddenConfig>,
    required: true,
  },
});

const n = computed(() => props.name || props.config.name || '');

// eslint-disable-next-line vue/no-undef-properties
useAddField(props.prop);
</script>
