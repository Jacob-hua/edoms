<template>
  <div ref="wrapper" class="business-wrapper">
    <div class="business-header">
      <span>{{ title }}</span>
      <span>{{ subtitle }}</span>
      <slot name="operation"></slot>
    </div>
    <div class="business-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { isNumber } from '@edoms/utils';

const props = defineProps<{
  title?: string;
  subtitle?: string;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
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

const minHeight = computed<number | undefined>(() => {
  if (typeof props.minHeight === 'number') {
    return props.minHeight;
  }
  if (typeof props.minHeight === 'string' && isNumber(props.minHeight)) {
    return Number(props.minHeight);
  }
  return undefined;
});

const scale = computed<number>(() => {
  if (!minWidth.value || !minHeight.value) {
    return 1;
  }
  return minWidth.value / minHeight.value;
});

const maxWidth = computed<number | undefined>(() => {
  if (!props.maxWidth && props.maxHeight && typeof props.maxHeight === 'string' && isNumber(props.maxHeight)) {
    return Number(props.maxHeight) * scale.value;
  }
  if (typeof props.maxWidth === 'string' && isNumber(props.maxWidth)) {
    return Number(props.maxWidth);
  }
  return undefined;
});

const maxHeight = computed<number | undefined>(() => {
  if (!props.maxHeight && props.maxWidth && typeof props.maxWidth === 'string' && isNumber(props.maxWidth)) {
    return Number(props.maxWidth) / scale.value;
  }
  if (typeof props.maxHeight === 'string' && isNumber(props.maxHeight)) {
    return Number(props.maxHeight);
  }
  return undefined;
});

const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  const [wrapperEntry] = entries;
  const widthScale = (wrapperEntry.contentRect.width * 1.0) / (minWidth.value ?? 1);
  const heightScale = (wrapperEntry.contentRect.height * 1.0) / (minHeight.value ?? 1);
  elementAddStyle(wrapperEntry.target, `aspect-ratio:${scale.value};height: auto;`);
  Array.from(wrapperEntry.target.children).forEach((element: Element) => {
    elementAddStyle(
      element,
      `
      transform:scale(${Math.min(widthScale, heightScale)});
      transform-origin: top left;
      `
    );
  });
});

onMounted(() => {
  if (!wrapper.value) {
    return;
  }
  resizeObserver.observe(wrapper.value);
});

onUnmounted(() => {
  if (!wrapper.value) {
    return;
  }
  resizeObserver.unobserve(wrapper.value);
});

function elementAddStyle(element: Element, style: string) {
  const originStyle = element.getAttribute('style');
  element.setAttribute('style', `${originStyle};${style}`);
}
</script>

<style lang="scss">
.business-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid #313131;
  border-radius: 3px;
  background-color: #2c2c2c;
  min-width: v-bind(minWidth) px;
  min-height: v-bind(minHeight) px;
  max-width: v-bind(maxWidth) px;
  max-height: v-bind(maxHeight) px;
}
</style>
