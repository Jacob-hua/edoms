<template>
  <div
    :id="idList"
    :style="{ width: typeof props.width === 'number' ? props.width + 'px' : props.width, height: props.height + 'px' }"
    class="chart-ct"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, withDefaults } from 'vue';
import * as echarts from 'echarts/core';
// import { ECOption } from '../../../types';

const props = withDefaults(
  defineProps<{
    options: any;
    width: number | string;
    height: number;
    isFresh: boolean;
  }>(),
  {
    options: () => ({}),
    width: 0,
    height: 0,
    isFresh: false,
  }
);
const idList = ref<string>(Math.random().toString().substring(3, 30));

let chart: echarts.ECharts | null = null;

const initData = (type: string) => {
  const dom = document.getElementById(type);
  dom?.removeAttribute('_echarts_instance_');
  chart = echarts.init(dom as HTMLElement);
  chart.setOption(props.options, true);
};

watch(
  () => props.isFresh,
  (newV) => {
    if (newV) {
      setTimeout(() => {
        chart?.resize();
      }, 300);
    }
  }
);

watch(
  () => props.options,
  () => {
    console.log(props);
    chart?.setOption(props.options, true);
  },
  {
    deep: true,
  }
);

onMounted(() => {
  setTimeout(() => {
    initData(idList.value);
  }, 300);
});

onUnmounted(() => {
  chart?.dispose();
});
</script>

<style lang="scss" scoped></style>
