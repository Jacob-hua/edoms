<template>
  <div>
    <el-popover trigger="hover" effect="dark" :width="392">
      <template #reference>
        <el-button class="m-2"></el-button>
      </template>
      <EdomsCharts :option="option" :width="350" :height="160"></EdomsCharts>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { dateRange, formatCurrentDateRange, formatDate, stringToDate } from '@edoms/utils';

import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import { MIndicator, MIndicatorConfig } from './type';

const props = defineProps<{
  config: MIndicatorConfig;
}>();

const option = ref<ECOption>({});
const { request } = useApp(props);
const { fetchHistoryData } = apiFactory(request);

const indicatorConfigs = computed<MIndicator[]>(() => props.config.indicators);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const updateParameterData = async () => {
  if (!indicatorConfigs.value || indicatorConfigs.value.length <= 0) return;
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: indicatorConfigs.value.map(({ instance, property }) => ({
      deviceCode: instance[instance.length - 1],
      propCode: property,
    })),
  });
  if (!result || result.length <= 0) return;

  let chartSeries = [];
  chartSeries = result.map(({ insCode, propCode, dataList }) => {
    const indicatorConfig =
      indicatorConfigs.value[
        indicatorConfigs.value.findIndex(
          ({ instance, property }) => insCode === instance[instance.length - 1] && propCode === property
        )
      ];
    return {
      name: indicatorConfig.label,
      type: 'line',
      showSymbol: false,
      color: indicatorConfig.lineColor,
      data: dataList.map(({ time, value }) => [stringToDate(time), value]),
    };
  });
  option.value = generateOption(chartSeries);
};

function generateOption(series: any[] = []): ECOption {
  const legends = series.map(({ name }) => name);

  return {
    legend: {
      data: legends,
      textStyle: {
        color: '#ffffff85',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '20%',
      right: '1%',
      top: 30,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
      splitLine: {
        show: false,
      },
      // minInterval: 3600 * 1000 * 2,
      // maxInterval: 3600 * 1000 * 2,
      // interval: 3600 * 1000 * 2,
      axisLabel: {
        formatter: function (value: any) {
          return formatDate(value, 'HH:mm');
        },
        interval: 1,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ffffff45',
        },
      },
      axisLine: {
        show: true,
      },
    },
    series,
  };
}
useIntervalAsync(updateParameterData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.m-2 {
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
