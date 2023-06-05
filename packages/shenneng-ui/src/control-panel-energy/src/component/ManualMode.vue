<template>
  <el-card class="info-card">
    <div class="anticipate">
      <div class="anticipate-info">
        <div>
          <span>当前状态：</span>
          <span class="anticipate-value">供电</span>
        </div>
        <div>
          <span>供电功率：</span>
          <span class="anticipate-value">100kW</span>
        </div>
      </div>
      <div class="btn">
        <el-button @click="handleSetting">设置</el-button>
      </div>
    </div>
    <div class="chart-box">
      <EdomsCharts class="chart-container" :option="options"></EdomsCharts>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { dateRange } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

const emit = defineEmits<{
  (event: 'settingAction', data: boolean): void;
}>();

const options = computed<ECOption>(() => {
  return {
    textStyle: {
      color: '#D8D8D8',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
      maxInterval: 3600 * 1000,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: '{HH}:{mm}',
      },
    },
    yAxis: {
      name: `kW`,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ffffff85',
        },
      },
    },
    series: [],
  };
});

const handleSetting = () => {
  console.log(111);
  emit('settingAction', true);
};
</script>

<style lang="scss" scoped>
.info-card {
  --el-card-bg-color: rgba(9, 15, 23, 0.3);
  --el-card-border-color: rgba(1, 52, 96, 1);
  --el-text-color-primary: rgba(234, 245, 255, 1);
  // background: rgba(9, 15, 23, 0.3);

  .anticipate {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-column-gap: 22px;
    align-items: center;

    .anticipate-info {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 60px;

      .anticipate-value {
        color: rgba(56, 208, 20, 1);
      }
    }
  }

  .chart-container {
    height: 450px;
    width: 100%;
  }
}
</style>
