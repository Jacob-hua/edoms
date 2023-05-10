<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-25 16:01:29
-->
<template>
  <div class="wrapper">
    <div class="echart" style="width: 485px">负载率</div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

defineProps<{
  option: ECOption;
}>();
</script>

<style lang="scss" scoped>
.charts {
  width: 485px;
  height: 280px;
}
</style>
