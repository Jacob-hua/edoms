<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-25 16:01:29
-->
<template>
  <div class="wrapper">
    <div style="width: 300px; border-right: 1px solid #212c3c">占比分布</div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

const props = defineProps<{
  option: ECOption;
}>();
console.log(props.option);
</script>

<style lang="scss" scoped>
.charts {
  width: 300px;
  height: 280px;
}
</style>
