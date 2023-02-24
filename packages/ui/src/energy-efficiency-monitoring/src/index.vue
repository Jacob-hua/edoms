<template>
  <div>
    <BusinessCard
      class="energy-efficiency-wrapper"
      title="能效监测"
      subtitle="ENERGY EFFICIENCY MONITORING"
      min-width="392"
      min-height="160"
    >
      <template #operation>
        <div :class="operatable" @click="handleShowMore">...</div>
      </template>
      <div class="efficiency-wrapper">
        <div class="actual-wrapper">
          <div :title="actualValue" class="actual-value">{{ actualValue }}</div>
          <div class="actual-unit overflow-ellipsis">{{ energyName }}</div>
        </div>
        <div style="padding-top: 28px">
          <Efficiency v-bind="indicators" :actual-value="actualValue"></Efficiency>
        </div>
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

import EChartsDialog from './component/EChartsDialog.vue';
import Efficiency from './component/Efficiency.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MEfficiencyMonitoring } from './type';

interface Indicator {
  minValue: string;
  maxValue: string;
  refrenceValue: string;
  bisectionNumber?: number;
  startColor: string;
  endColor: string;
  cursorColor?: string;
  refrenceLineColor?: string;
}

const props = defineProps<{
  config: MEfficiencyMonitoring;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData, fetchHistoryData } = apiFactory(request);

const actualValue = ref<string>('');
const energyName = ref<string>('COP');

const indicators = ref<Indicator>({
  minValue: '0',
  maxValue: '0',
  refrenceValue: '0',
  startColor: '',
  endColor: ',',
});

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

const operatable = computed(() => 'operation');

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
    indicators.value = {
      minValue: val.minValue ?? '',
      maxValue: val.maxValue ?? '',
      refrenceValue: val.refrenceValue ?? '',
      refrenceLineColor: val.refrenceLineColor,
      bisectionNumber: val.bisectionNumber,
      startColor: val.startColor ?? '',
      endColor: val.endColor ?? '',
      cursorColor: val.cursorColor,
    };
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
    // actualValue.value = efficiencyNum;
    actualValue.value = String(formatPrecision(Number(efficiencyNum), efficiencyConfig.value.precision));
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
.energy-efficiency-wrapper {
  width: inherit;
  height: inherit;
}

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
  display: flex;
  height: 100%;

  .actual-wrapper {
    padding: 24px 20px 0 16px;
    display: flex;
    flex-direction: column;
    width: 74px;

    .actual-value {
      font-size: 24px;
      font-weight: 800;
      color: #00ff00;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actual-unit {
      font-size: 14px;
      color: #ffffff65;
    }
  }
}
</style>
