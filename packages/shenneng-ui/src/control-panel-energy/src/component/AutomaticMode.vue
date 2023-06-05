<template>
  <el-card class="info-card">
    <div class="anticipate">
      <div class="anticipate-info">
        <div>
          <span>预期总收益：</span>
          <span class="anticipate-value">1483.8元</span>
        </div>
        <div>
          <span>预期总量：</span>
          <span class="anticipate-value">6451.4kWh</span>
        </div>
        <div>
          <span>预期度电收益：</span>
          <span class="anticipate-value">0.23/kWh</span>
        </div>
      </div>
      <div class="btn">
        <el-button>启动优化</el-button>
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
    justify-content: space-between;
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
