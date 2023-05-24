<template>
  <div class="wrapper">
    <div class="wrapper_zhan">占比分布</div>
    <EdomsCharts class="wrapper_chart" :option="option"></EdomsCharts>
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
.wrapper {
  margin: auto;

  .wrapper_zhan {
    margin-left: 22px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
  }

  .wrapper_chart {
    width: 340px;
    height: 276px;
  }
}
</style>
