<template>
  <component :is="uiComponent.component" v-bind="uiProps" @close="closeHandler" @update:model-value="updateModelValue">
    <template #header>
      <slot name="header"></slot>
    </template>
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
  lockScroll?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt';
  showClose?: boolean;
  openDelay?: number;
  closeDelay?: number;
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
