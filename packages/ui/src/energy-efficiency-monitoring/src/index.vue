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
      @magictype-change="handleChangeMagictype"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { daysInMonth, formatDate, formatDateRange, formatPrecision, UnitTime } from '@edoms/utils';

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

const operationClass = computed(() => 'operation');

const xAxisData = computed(() => {
  let defaultResult = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];
  if (dateType.value === 'day') {
    return defaultResult;
  } else if (dateType.value === 'month') {
    const days = daysInMonth(new Date());
    defaultResult = [];
    for (let i = 1; i <= days; i++) {
      defaultResult.push(i < 10 ? `0${i}` : `${i}`);
    }
    return defaultResult;
  } else {
    defaultResult = [];
    for (let i = 1; i <= 12; i++) {
      defaultResult.push(i < 10 ? `0${i}` : `${i}`);
    }
    return defaultResult;
  }
});

const formatXAxisLabel = computed(() => {
  if (dateType.value === 'day') {
    return 'HH:mm';
  }
  if (dateType.value === 'month') {
    return 'dd';
  }
  if (dateType.value === 'year') {
    return 'MM';
  }
  return 'HH:mm';
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
      type: 'category',
      splitLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
      data: xAxisData.value,
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
    actualValue.value = +formatPrecision(Number(efficiencyNum), efficiencyConfig.value.precision);
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
    data: dataList.map(({ time, value }) => {
      const label = formatDate(time, formatXAxisLabel.value);
      return [label, formatPrecision(+value, efficiencyConfig.value.precision)];
    }),
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
  grid-template-columns: 76px 1fr;
  grid-template-rows: repeat(2, 1fr);
  column-gap: 20px;
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
