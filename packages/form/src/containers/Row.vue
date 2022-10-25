<template>
  <ElRow :gutter="10">
    <Col
      v-for="(col, index) in config.items"
      :key="col[mForm?.keyProp || '__key'] ?? index"
      :span="col.span || config.span || 24 / config.items.length"
      :config="col"
      :label-width="config.labelWidth || labelWidth"
      :expand-more="expandMore"
      :model="name ? model[name] : model"
      :prop="prop"
      :size="size"
      @change="changeHandler"
    />
  </ElRow>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import { ElRow } from '@edoms/design';

import { FormState, RowConfig } from '../schema';

import Col from './Col.vue';

const props = defineProps<{
  model: any;
  config: RowConfig;
  name: string;
  labelWidth?: string;
  prop?: string;
  size?: string;
  expandMore?: boolean;
}>();

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');

const changeHandler = () => emit('change', props.name ? props.model[props.name] : props.model);
</script>
