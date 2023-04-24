<template>
  <div ref="wrapper" class="business-wrapper">
    <div class="business-wrapper-header">
      <div class="title-wrapper">
        <span class="title">{{ title }}</span>
        <span class="subtitle">{{ subtitle }}</span>
      </div>
      <div class="operation-wrapper">
        <slot name="operation"></slot>
      </div>
    </div>
    <div class="business-wrapper-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { isNumber } from '@edoms/utils';

const props = defineProps<{
  title?: string;
  subtitle?: string;
  minWidth?: string | number;
  minHeight?: string | number;
}>();

const wrapper = ref<HTMLElement | null>(null);

const minWidth = computed<number | undefined>(() => {
  if (typeof props.minWidth === 'number') {
    return props.minWidth;
  }
  if (typeof props.minWidth === 'string' && isNumber(props.minWidth)) {
    return Number(props.minWidth);
  }
  return undefined;
});

const cssMinWidth = computed<string>(() => (minWidth.value ? `${minWidth.value}px` : 'auto'));

const minHeight = computed<number | undefined>(() => {
  if (typeof props.minHeight === 'number') {
    return props.minHeight;
  }
  if (typeof props.minHeight === 'string' && isNumber(props.minHeight)) {
    return Number(props.minHeight);
  }
  return undefined;
});

const cssMinHeight = computed<string>(() => (minHeight.value ? `${minHeight.value}px` : 'auto'));
</script>

<style lang="scss">
.business-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: rgba(31, 30, 29, 1);
  min-width: v-bind(cssMinWidth);
  min-height: v-bind(cssMinHeight);
  width: inherit;
  height: inherit;
  color: #ffffff85;
}
.business-wrapper-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 16px 0 16px;

  & > .title-wrapper {
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff85;
      padding-right: 4px;
    }

    .subtitle {
      color: #ffffff45;
      font-size: 10px;
    }
  }

  & > .operation-wrapper {
    cursor: pointer;
  }
}
.business-wrapper-body {
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
</style>
