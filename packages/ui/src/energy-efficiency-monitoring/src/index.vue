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
      @magictype-change="handleChangeMagictype"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { dateRange, formatDateRange, formatPrecision, stringToDate, timeSubtract, UnitTime } from '@edoms/utils';

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
const dateType = ref<UnitTime>('day');

const magictype = ref<string>('line');
const chartSeries = ref<any[]>([]);

const efficiencyConfig = computed<MEfficiencyMonitoring>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const operatable = computed(() => 'operation');

const xAxisMin = computed(() => dateRange(new Date(), dateType.value).start);
// const xAxisMax = computed(() => dateRange(new Date(), dateType.value).end);
const xAxisMax = computed(() => {
  const defaultMaxTime = dateRange(new Date(), dateType.value).end;
  if (magictype.value === 'line') {
    return dateRange(new Date(), dateType.value).end;
  } else if (magictype.value === 'bar') {
    if (dateType.value === 'day') {
      return timeSubtract(defaultMaxTime, 1, 'hour');
    }
    if (dateType.value === 'month') {
      return timeSubtract(defaultMaxTime, 1, 'day');
    }
    if (dateType.value === 'year') {
      return timeSubtract(defaultMaxTime, 1, 'month');
    }
    return dateRange(defaultMaxTime, 'day').start;
  }
  return dateRange(new Date(), dateType.value).end;
});

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

const maxInterval = computed(() => {
  if (dateType.value === 'day') {
    return 3600 * 1000;
  }
  if (dateType.value === 'month') {
    return 3600 * 1000 * 24;
  }
  if (dateType.value === 'year') {
    return 3600 * 1000 * 24 * 31;
  }
  return 3600 * 1000;
});

const options = computed<ECOption>(() => {
  return {
    legend: {
      show: true,
      textStyle: {
        color: '#ffffff85',
      },
    },
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
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: xAxisMin.value,
      max: xAxisMax.value,
      maxInterval: maxInterval.value,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: formatXAxisLabel.value,
        interval: 0,
      },
    },
    yAxis: {
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
    series: chartSeries.value.map((item) => {
      item.type = magictype.value;
      return item;
    }),
  };
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
  if (!efficiencyConfig.value.instance) {
    return;
  }
  const param: FetchEfficiencyReq = {
    insCodeList: [efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1]],
    propCode: 'COP',
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

const getHistoryData = async (date: Date, type: UnitTime = 'day') => {
  const { start, end } = formatDateRange(date, type, 'YYYY-MM-DD HH:mm:ss');
  let interval = '1h';
  if (type === 'day') {
    interval = '1h';
  } else if (type === 'month') {
    interval = '1d';
  } else {
    interval = '1n';
  }
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: interval,
    type: 'dev',
    dataList: [
      {
        deviceCode: efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1] ?? '',
        propCode: 'COP',
      },
    ],
  });
  chartSeries.value = result.map(({ dataList }, index) => ({
    name: energyName.value ? energyName : `未命名${index}`,
    type: magictype.value,
    showSymbol: false,
    data: dataList.map(({ time, value }) => [stringToDate(time), value]),
    itemStyle: {
      color: efficiencyConfig.value?.lineColor,
    },
  }));
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);

const handleShowMore = () => {
  dialogTitle.value = '能效监测';
  getHistoryData(new Date(), 'day');
  chartDialogVisible.value = true;
};

const handleChangeDateType = (type: UnitTime) => {
  dateType.value = type;
  magictype.value = 'line';
  getHistoryData(new Date(), type);
};

const handleChangeMagictype = (value: string) => {
  magictype.value = value;
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
