<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-26 11:02:44
-->
<template>
  <div class="legend-wrapper">
    <div v-for="item in legends" :key="item.type" class="legend">
      <div class="legend-top">
        <div class="color" :style="`background: ${item.data.color}`"></div>
        <div class="value" :style="`color: ${item.data.color}`">
          <span class="min"> {{ item.data.minValue }} </span>
          <span class="symbol">~</span>
          <span class="max"> {{ item.data.maxValue }}</span>
        </div>
      </div>
      <div class="legend-bottom">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { MEnergyMonitoring } from '../type';

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const legends = computed<any[]>(() => [
  {
    name: '中等',
    data: props.config.medium[0],
  },
  {
    name: '良好',
    data: props.config.good[0],
  },
  {
    name: '优异',
    data: props.config.excellent[0],
  },
]);
</script>

<style lang="scss" scoped>
.legend-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .legend {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .legend-top {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50%;
      .color {
        width: 12px;
        height: 12px;
        margin-right: 10px;
        border-radius: 2px;
      }
      .value {
        font-size: 14px;
        font-weight: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .legend-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #c4e5f8;
    }
  }
}
</style>
