<template>
  <div ref="chartsWrapperRef"></div>
</template>

<script setup lang="ts">
import { markRaw, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { EChartsType } from 'echarts/core';

import echarts from './echarts';
import { ECOption } from './types';

const props = defineProps<{
  option: ECOption;
}>();

const emit = defineEmits<{
  (event: 'magictypeChang', value: string): void;
}>();

const chartsWrapperRef = ref<HTMLDivElement>();

const charts = ref<EChartsType>();

const chartsResizeObserver = new ResizeObserver(() => {
  nextTick(() => {
    charts.value?.resize();
  });
});

watch(
  () => props.option,
  (option) => {
    if (!charts.value) {
      return;
    }

    charts.value.clear();
    charts.value.setOption(option, { notMerge: true });
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  nextTick(() => {
    if (!chartsWrapperRef.value) {
      return;
    }
    charts.value = markRaw(echarts.init(chartsWrapperRef.value));
    charts.value.setOption(props.option, { notMerge: true });
    charts.value.on('magictypechanged', (params: any) => {
      emit('magictypeChang', params.currentType);
    });
    chartsResizeObserver.observe(chartsWrapperRef.value);
  });
});

onUnmounted(() => {
  if (chartsWrapperRef.value) {
    chartsResizeObserver.unobserve(chartsWrapperRef.value);
  } else if (charts.value) {
    charts.value.dispose();
    charts.value = undefined;
  }
});
</script>
