<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard title="能效监测" subtitle="ENERGY EFFICIENCY MONITORING" min-width="392" min-height="160">
      <template #operation>
        <div :class="operationClass" @click="handleShowMore">...</div>
      </template>
      <div class="efficiency-wrapper">
        <ActualCard class="actual-card" :config="config" :actual-value="actualValue"></ActualCard>
        <ColorCard class="color-card" :config="config" :actual-value="actualValue"></ColorCard>
        <ColorLegend class="color-legend" :config="config"></ColorLegend>
      </div>
    </BusinessCard>
    <EChartsDialog
      v-if="chartDialogVisible"
      v-model:visible="chartDialogVisible"
      :title="dialogTitle"
      :width="960"
      :height="480"
      :options="options"
      @type-change="handleChangeDateType"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { dateRange, formatDateRange, formatPrecision, stringToDate, UnitTime } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import ActualCard from './component/ActualCard.vue';
import ColorCard from './component/ColorCard.vue';
import ColorLegend from './component/ColorLegend.vue';
import EChartsDialog from './component/EChartsDialog.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MEfficiencyMonitoring } from './type';

const props = defineProps<{
  config: MEfficiencyMonitoring;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData, fetchHistoryData } = apiFactory(request);

const actualValue = ref<number>(0);
const energyName = ref<string>('COP');

const chartDialogVisible = ref<boolean>(false);
const dialogTitle = ref<string>('');
const options = ref<ECOption>({});
const dateType = ref<UnitTime>('day');

const efficiencyConfig = computed<MEfficiencyMonitoring>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const operationClass = computed(() => 'operation');

const formatXAxisLabel = computed(() => {
  if (dateType.value === 'day') {
    return '{HH}:{mm}';
  }
  if (dateType.value === 'month') {
    return '{dd}';
  }
  if (dateType.value === 'year') {
    return '{MM}';
  }
  return '{HH}:{mm}';
});

watch(
  () => efficiencyConfig.value,
  (val) => {
    energyName.value = val.energyName;
  },
  {
    immediate: true,
  }
);

const updateEfficiencyData = async () => {
  if (!efficiencyConfig.value.instance || !efficiencyConfig.value.property) {
    return;
  }
  const param: FetchEfficiencyReq = {
    insCodeList: [efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1]],
    propCode: efficiencyConfig.value.property,
  };
  const result = await fetchEfficiencyData(param);
  result.forEach(({ insCode, efficiencyNum }) => {
    if (insCode !== efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1]) {
      return;
    }
    actualValue.value = +formatPrecision(Number(efficiencyNum), efficiencyConfig.value.precision);
  });
};

const generateOption = (series: any[] = []): ECOption => {
  return {
    toolbox: {
      show: true,
      feature: {
        magicType: {
          type: ['line', 'bar'],
        },
      },
      showTitle: false,
      right: '10%',
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}COP`,
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: dateRange(new Date(), dateType.value).start,
      max: dateRange(new Date(), dateType.value).end,
      splitLine: {
        show: false,
      },
      interval: 2,
      axisLabel: {
        formatter: formatXAxisLabel.value,
        interval: 2,
      },
    },
    yAxis: {
      name: `单位：COP`,
      type: 'value',
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
};

const getHistoryData = async (date: Date, type: UnitTime = 'day') => {
  const { start, end } = formatDateRange(date, type, 'YYYY-MM-DD HH:mm:ss');
  let interval = '1m';
  if (type === 'day') {
    interval = '1m';
  } else {
    interval = '1d';
  }
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: interval,
    type: 'dev',
    dataList: [
      {
        deviceCode: efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1] ?? '',
        propCode: efficiencyConfig.value.property ?? '',
      },
    ],
  });

  const chartSeries = result.map(({ dataList }) => ({
    name: energyName.value,
    type: 'line',
    showSymbol: false,
    data: dataList.map(({ time, value }) => [stringToDate(time), value]),
    itemStyle: {
      color: efficiencyConfig.value?.lineColor,
    },
  }));
  options.value = generateOption(chartSeries);
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);

const handleShowMore = () => {
  dialogTitle.value = '能效监测';
  getHistoryData(new Date(), 'day');
  chartDialogVisible.value = true;
};

const handleChangeDateType = (type: UnitTime) => {
  dateType.value = type;
  getHistoryData(new Date(), type);
};
</script>

<style lang="scss" scoped>
.overflow-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operation {
  font-size: 28px;
  cursor: pointer;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff85;
  text-align: center;
}

.dis-operation {
  font-size: 28px;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff45;
  text-align: center;
  cursor: default;
}

.open {
  font-size: 36px;
  cursor: pointer;
  position: relative;
  top: -14px;
}

.efficiency-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  margin-top: 20px;
  grid-template-columns: 36px 1fr;
  grid-template-rows: repeat(2, 1fr);
  column-gap: 50px;
  align-items: center;
}

.actual-card {
  grid-column: 1 / 2;
}

.color-card {
  grid-column: 2 / 2;
}

.color-legend {
  grid-row: 2 / 2;
  grid-column: 2 / 2;
}
</style>
