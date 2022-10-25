<template>
  <component :is="uiComponent.component" v-bind="uiProps">
    <template #default>
      <slot></slot>
    </template>

    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getConfig } from './config';

const props = defineProps<{
  name?: string;
  label?: string;
  lazy?: boolean;
}>();
const uiComponent = getConfig('components').tabPane;

const uiProps = computed(() => uiComponent.props(props));
</script>
