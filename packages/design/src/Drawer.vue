<template>
  <component :is="uiComponent.component" v-bind="uiProps" @close="closeHandler" @update:model-value="updateModelValue">
    <slot></slot>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getConfig } from './config';

const props = defineProps<{
  modelValue?: boolean;
  appendToBody?: boolean;
  title?: string;
  size?: string | number;
  closeOnClickModal?: boolean;
}>();

const uiComponent = getConfig('components').drawer;

const uiProps = computed(() => uiComponent.props(props));

const emit = defineEmits(['close', 'update:modelValue']);

const closeHandler = (...args: any[]) => {
  emit('close', ...args);
};

const updateModelValue = (v: any) => {
  emit('update:modelValue', v);
};
</script>
