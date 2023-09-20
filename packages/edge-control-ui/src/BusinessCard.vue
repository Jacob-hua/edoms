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
  min-width: v-bind(cssMinWidth);
  min-height: v-bind(cssMinHeight);
  width: inherit;
  height: inherit;
  color: #ffffff85;
  overflow: hidden;
}
.business-wrapper-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  padding: 16px;
  height: 41px;
  & > .title-wrapper {
    display: flex;
    align-items: center;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    gap: 4px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff85;
    }

    .subtitle {
      font-family: 'Arial', 'Microsoft YaHei', sans-serif;
      color: #ffffff45;
      font-size: 10px;
    }

    .subtitle::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        #ffffff45 2px,
        #ffffff45 4px
      ); /* 虚线样式和颜色 */
    }
  }

  & > .operation-wrapper {
    cursor: pointer;
  }
}
.business-wrapper-body {
  height: 100%;
  background-color: inherit;
  overflow: hidden;
  display: flex;
}
</style>
