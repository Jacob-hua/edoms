<template>
  <div ref="chartsContainer" :style="styleObj"></div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

import echarts from './echarts';

const props = withDefaults(
  defineProps<{
    width: string;
    height: string;
  }>(),
  {
    width: '600px',
    height: '500px',
  }
);

const styleObj = computed(() => `width: ${props.width}; height: ${props.height};`);

const chartsContainer = ref<HTMLDivElement>();

watchEffect(() => {
  if (!chartsContainer.value) {
    return;
  }
  echarts.init(chartsContainer.value).setOption({
    title: {
      text: 'ECharts 入门示例',
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });
});
</script>

<style scoped>
.wrapper {
  width: 500px;
  height: 500px;
}
</style>
