<template>
  <div class="legend-wrapper">
    <div class="legend">
      <div class="legend-block" :style="{ backgroundColor: config.startColor }"></div>
      <span>较差</span>
    </div>
    <div class="legend">
      <div class="legend-block" :style="{ backgroundColor: config.endColor }"></div>
      <span>优秀</span>
    </div>
    <div class="legend">
      <div class="legend-line" :style="{ backgroundColor: config.referenceLineColor }"></div>
      <span>参考值</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MEfficiencyMonitoring } from '../type';

defineProps<{
  config: MEfficiencyMonitoring;
}>();
</script>

<style lang="scss" scoped>
.legend-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.legend {
  display: flex;
  justify-content: space-around;
  align-items: center;
  span {
    color: #ffffff65;
    margin-left: 8px;
  }
}

.legend-block {
  width: 16px;
  height: 16px;
}

.legend-line {
  width: 2px;
  height: 20px;
}
</style>
