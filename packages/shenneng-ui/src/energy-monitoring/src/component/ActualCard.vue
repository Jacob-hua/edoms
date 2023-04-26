<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-25 15:05:39
-->
<template>
  <div class="actual-wrapper">
    <div class="actual-top">
      <div class="actual-value overflow-ellipsis" :title="`${actualValue}`">{{ actualValue }}</div>
      <div class="actual-unit overflow-ellipsis" :title="config.energyName">{{ config.energyName }}</div>
    </div>
    <div class="actual-bottom">当前系统能效</div>
  </div>
</template>

<script lang="ts" setup>
import { MEnergyMonitoring } from '../type';
defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();
</script>

<style lang="scss" scoped>
.actual-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actual-top {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 13px;
    .actual-value {
      color: #00fff0;
      font-size: 20px;
      margin-right: 4px;
    }
    .actual-unit {
      color: #c4e5f8;
      font-size: 16px;
    }
  }
  actual-bottom {
    color: #c4e5f8;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  //   .actual-value {
  //     font-size: 24px;
  //     font-weight: 800;
  //     color: #00ff00;
  //     margin-bottom: 4px;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     line-height: 24px;
  //     min-height: 24px;
  //   }

  //   .actual-unit {
  //     font-size: 14px;
  //     font-weight: 400;
  //     color: #ffffff65;
  //   }
}
</style>
