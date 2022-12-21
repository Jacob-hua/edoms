<template>
  <div>
    <span>测试页面</span>
    <EdomsCharts width="800" height="800" :option="option" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
const option = ref({
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

setInterval(() => {
  option.value.series[0].data = option.value.series[0].data.map(() => 50 * Math.random());
}, 2000);

watch(
  () => option.value,
  () => {
    console.log('===');
  }
);
</script>
