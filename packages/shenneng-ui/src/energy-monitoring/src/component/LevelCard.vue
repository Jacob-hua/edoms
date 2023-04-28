<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-26 17:19:02
-->
<template>
  <div class="level-wrapper">
    <div class="level-top">
      <div class="level-value overflow-ellipsis" :title="`${actualValue}`">{{ actualValue || '高' }}</div>
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
}
</style>
