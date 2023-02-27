<template>
  <div class="actual-wrapper">
    <div class="actual-value">{{ actualValue }}</div>
    <div class="actual-unit overflow-ellipsis">{{ config.energyName }}</div>
  </div>
</template>

<script lang="ts" setup>
import { MEfficiencyMonitoring } from '../type';
defineProps<{
  config: MEfficiencyMonitoring;
  actualValue: number;
}>();
</script>

<style lang="scss" scoped>
.actual-wrapper {
  display: flex;
  flex-direction: column;

  .actual-value {
    font-size: 24px;
    font-weight: 800;
    color: #00ff00;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 24px;
    min-height: 24px;
  }

  .actual-unit {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff65;
  }
}
</style>
