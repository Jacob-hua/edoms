<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-26 09:40:09
-->
<template>
  <div class="level-wrapper">
    <div class="level-top">
      <div class="level-value overflow-ellipsis" :title="`${actualValue}`">{{ actualValue }}</div>
    </div>
    <div class="level-bottom">能效等级</div>
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
.level-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .level-top {
    display: flex;
    align-items: center;
    justify-content: center;
    // margin-top: 20px;
    margin-bottom: 13px;
    .level-value {
      color: #00fff0;
      font-size: 20px;
      margin-right: 4px;
    }
    .level-unit {
      color: #c4e5f8;
      font-size: 16px;
    }
  }
  .level-bottom {
    color: #c4e5f8;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  //   .level-value {
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

  //   .level-unit {
  //     font-size: 14px;
  //     font-weight: 400;
  //     color: #ffffff65;
  //   }
}
</style>
