<template>
  <div ref="wrapper" class="business-wrapper">
    <div class="business-wrapper-header">
      <div class="title-wrapper" need-zoom="top;left">
        <span class="title">{{ title }}</span>
        <span class="subtitle">{{ subtitle }}</span>
      </div>
      <div class="operation-wrapper" need-zoom="top;right">
        <slot name="operation"></slot>
      </div>
    </div>
    <div class="business-wrapper-body" need-zoom="top;left">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { isNumber, style2Obj, styleObj2Str } from '@edoms/utils';

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

const cssMaxWidth = computed<string>(() => (maxWidth.value ? `${maxWidth.value}px` : 'auto'));

const maxHeight = computed<number | undefined>(() => {
  if (!props.maxHeight && props.maxWidth && typeof props.maxWidth === 'string' && isNumber(props.maxWidth)) {
    return Number(props.maxWidth) / scale.value;
  }
  if (typeof props.maxHeight === 'string' && isNumber(props.maxHeight)) {
    return Number(props.maxHeight);
  }
  return undefined;
});

const cssMaxHeight = computed<string>(() => (maxHeight.value ? `${maxHeight.value}px` : 'auto'));

const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
  const [wrapperEntry] = entries;
  const widthScale = (wrapperEntry.contentRect.width * 1.0) / (minWidth.value ?? 1);
  const heightScale = (wrapperEntry.contentRect.height * 1.0) / (minHeight.value ?? 1);
  const styleObj = style2Obj(wrapperEntry.target.getAttribute('style') ?? '');
  styleObj['aspect-ratio'] = scale.value;
  styleObj['height'] = 'auto';
  wrapperEntry.target.setAttribute('style', styleObj2Str(styleObj));
  wrapperEntry.target.querySelectorAll('[need-zoom]').forEach((element: Element) => {
    const origin = element.getAttribute('need-zoom') ?? 'top;left';

    element.setAttribute(
      'style',
      `
      transform:scale(${Math.min(widthScale, heightScale)});
      transform-origin: ${origin.replace(';', ' ')};
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
</script>

<style lang="scss">
.business-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  background-color: #2c2c2c;
  min-width: v-bind(cssMinWidth);
  min-height: v-bind(cssMinHeight);
  max-width: v-bind(cssMaxWidth);
  max-height: v-bind(cssMaxHeight);
  color: #ffffff85;
  padding: 12px;
}
.business-wrapper-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 3px;

  & > .title-wrapper {
    display: flex;
    .title {
      font-size: 16px;
      font-weight: 400;
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
}
</style>
