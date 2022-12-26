<template>
  <div ref="chartsContainer" :style="styleObj"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { EChartsType } from 'echarts/core';

import echarts from './echarts';
import { ECOption } from './type';

const props = withDefaults(
  defineProps<{
    width: number;
    height: number;
    option: ECOption;
  }>(),
  {
    width: 600,
    height: 500,
  }
);

const styleObj = computed(() => `width: ${props.width}px; height: ${props.height}px;`);

const chartsContainer = ref<HTMLDivElement>();

const charts = ref<EChartsType>();

watch(
  () => ({ width: props.width, height: props.height }),
  ({ width, height }) => {
    if (!charts.value) {
      return;
    }
    charts.value.resize({
      width,
      height,
    });
  }
);

watch(
  () => props.option,
  (option) => {
    console.log('图表option变化', props.option);
    if (!charts.value) {
      return;
    }
    charts.value.setOption(option);
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  if (!chartsContainer.value) {
    return;
  }
  charts.value = echarts.init(chartsContainer.value);
  charts.value.setOption(props.option);
});

onUnmounted(() => {
  if (!charts.value) {
    return;
  }
  charts.value.dispose();
  charts.value = undefined;
});
</script>

<style scoped>
.wrapper {
  width: 500px;
  height: 500px;
}
</style>
