<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard title="动环监测" subtitle="DYNAMIC MONITORING" min-width="392" min-height="160">
      <template #operation>
        <div :class="operatable" @click="handleTrigger">...</div>
      </template>
      <div class="dynamic-monitoring">
        <div v-for="(item, index) in initIndicators" :key="index" @click="handleDisplayCharts(item)">
          <img :src="item.icon" alt="" />
          <div :title="item.displayParameter" class="parameter" :style="item.parameterStyle">
            <el-row>
              <el-col class="data-value" :span="14">{{ item.parameter }}</el-col>
              <el-col :span="10">{{ item.unit }}</el-col>
            </el-row>
          </div>
          <div class="label overflow-ellipsis">{{ item.label }}</div>
        </div>
      </div>
    </BusinessCard>
    <MoreParameters
      v-if="restParamVisible"
      v-model:visible="restParamVisible"
      :data="restIndicators"
      @item-click="handleClickIndicator"
    ></MoreParameters>
    <EChartsDialog
      v-if="chartDialogVisible"
      v-model:visible="chartDialogVisible"
      :title="dialogTitle"
      :options="options"
      @date-change="handleDateChange"
      @magictype-change="handleChangeMagictype"
    ></EChartsDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { dateRange, formatDateRange, formatPrecision, stringToDate, timeSubtract } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import GasImg from './assets/gas.svg';
import LiquidDepthImg from './assets/liquidDepth.svg';
import MoistureImg from './assets/moisture.svg';
import TemperatureImg from './assets/temperature.svg';
import EChartsDialog from './component/EChartsDialog.vue';
import MoreParameters from './component/MoreParameters.vue';
import apiFactory from './api';
import { MDynamicMonitoring, MEnvironmentIndicator, MIndicatorItemConfig, ParameterItem } from './type';

export interface Indicator {
  icon: string;
  parameter: string;
  displayParameter: string;
  parameterStyle: {};
  label: string;
  deviceCode: string;
  propCode: string;
  unit: string;
  precision: string;
  lineColor: string;
}

const props = defineProps<{
  config: MDynamicMonitoring;
}>();

const { request } = useApp(props);

const { fetchIndicatorData, fetchHistoryData } = apiFactory(request);

const indicators = ref<Indicator[]>([]);
const initIndicators = ref<Indicator[]>([]);
const restIndicators = ref<Indicator[]>([]);
const activeIndicator = ref<Indicator>();

const dialogTitle = ref<string>('');
// const options = ref<ECOption>({});

const chartSeries = ref<any[]>([]);

const restParamVisible = ref<boolean>(false);
const chartDialogVisible = ref<boolean>(false);
const selectDate = ref(new Date());

const magictype = ref<string>('line');

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const operatable = computed(() => (restIndicators.value.length ? 'operation' : 'dis-operation'));

const xAxisMax = computed(() => {
  const defaultMaxTime = dateRange(new Date(), 'day').end;
  if (magictype.value === 'line') {
    return defaultMaxTime;
  } else if (magictype.value === 'bar') {
    return timeSubtract(defaultMaxTime, 1, 'hour');
  }
  return defaultMaxTime;
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
    grid: {
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}${activeIndicator.value?.unit}`,
    },
    xAxis: {
      type: 'time',
      min: dateRange(selectDate.value, 'day').start,
      max: xAxisMax.value,
      maxInterval: 3600 * 1000,
      splitLine: {
        show: false,
      },
      interval: 2,
      axisLabel: {
        formatter: '{HH}:{mm}',
        interval: 2,
      },
    },
    yAxis: {
      name: `单位：${activeIndicator.value?.unit}`,
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
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs.map(({ label, type, instance, property, unit, lineColor, precision }) => ({
      label,
      parameter: '',
      displayParameter: '',
      parameterStyle: { color: '#00ff00' },
      icon: getIconByIndicatorType(type),
      deviceCode: instance[instance.length - 1],
      propCode: property,
      unit: unit,
      precision: precision,
      lineColor: lineColor,
    }));
    if (indicators.value.length > 5) {
      initIndicators.value = indicators.value.slice(0, 5);
      restIndicators.value = indicators.value.slice(5);
    } else {
      initIndicators.value = indicators.value;
      restIndicators.value = [];
    }
  },
  {
    immediate: true,
  }
);

const updateIndicatorsData = async () => {
  const dataList: ParameterItem[] = indicatorConfigs.value.map(
    ({ instance, property }): ParameterItem => ({
      deviceCode: instance[instance.length - 1],
      propCodeList: [property],
    })
  );

  if (dataList.length === 0) {
    return;
  }

  const result = await fetchIndicatorData({ dataList });

  result.forEach(({ dataValue, deviceCode, propCode }) => {
    const targetIndexs: number[] = [];
    indicatorConfigs.value.forEach(({ instance, property }, index) => {
      if (instance[instance.length - 1] === deviceCode && property === propCode) {
        targetIndexs.push(index);
      }
    });
    if (targetIndexs.length <= 0) {
      return;
    }
    targetIndexs.forEach((targetIndex) => {
      const indicatorConfig = indicatorConfigs.value[targetIndex];
      const indicator = indicators.value[targetIndex];
      indicator.parameter = formatPrecision(dataValue, indicatorConfig.precision);
      indicator.displayParameter = `${String(formatPrecision(dataValue, indicatorConfig.precision))} ${
        indicatorConfig.unit
      }`;
      indicator.parameterStyle = calculateParameterStyle(indicator, indicatorConfig);
      indicator.deviceCode = deviceCode;
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);

function getIconByIndicatorType(type: MEnvironmentIndicator) {
  const iconClassify = {
    [MEnvironmentIndicator.GAS]: GasImg,
    [MEnvironmentIndicator.LIQUID_DEPTH]: LiquidDepthImg,
    [MEnvironmentIndicator.MOISTURE]: MoistureImg,
    [MEnvironmentIndicator.TEMPERATURE]: TemperatureImg,
  };
  return iconClassify[type];
}

function calculateParameterStyle(indicator: Indicator, config: MIndicatorItemConfig) {
  const { thresholdConfigs } = config;
  const parameter = Number(indicator.parameter);
  const result = { color: '#00ff00' };
  thresholdConfigs.forEach(({ minValue, maxValue, alarmColor }) => {
    if (parameter >= minValue && parameter < maxValue) {
      result.color = alarmColor;
      return;
    }
  });
  return result;
}

const getHistoryData = async (date: Date) => {
  const { start, end } = formatDateRange(date, 'day', 'YYYY-MM-DD HH:mm:ss');
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: [
      {
        deviceCode: activeIndicator.value?.deviceCode ?? '',
        propCode: activeIndicator.value?.propCode ?? '',
      },
    ],
  });

  chartSeries.value = result.map(({ dataList }, index) => ({
    name: activeIndicator.value?.label ? activeIndicator.value.label : `未命名${index}`,
    type: magictype.value,
    showSymbol: false,
    data: dataList.map(({ time, value }) => [
      stringToDate(time),
      formatPrecision(+value, activeIndicator.value?.precision ?? ''),
    ]),
    itemStyle: {
      color: activeIndicator.value?.lineColor,
    },
  }));
};

const handleTrigger = () => {
  restParamVisible.value = restIndicators.value.length > 0;
};

const handleDisplayCharts = (item: Indicator) => {
  activeIndicator.value = item;
  dialogTitle.value = item.label;
  getHistoryData(new Date());
  chartDialogVisible.value = true;
};

const handleClickIndicator = (item: Indicator) => {
  handleDisplayCharts(item);
};

const handleDateChange = (value: string) => {
  magictype.value = 'line';
  selectDate.value = stringToDate(value);
  getHistoryData(stringToDate(value));
};

const handleChangeMagictype = (value: string) => {
  magictype.value = value;
};

watch(
  () => chartDialogVisible.value,
  (visible) => {
    if (!visible) {
      selectDate.value = new Date();
    }
  }
);
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

.dynamic-monitoring {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  height: 100%;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 72px;
    margin: 4px;

    .parameter {
      font-size: 14px;
      margin-bottom: 8px;
      width: 100%;
      text-align: center;
      font-weight: bold;

      .data-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .label {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }

  img {
    width: 32px;
    height: 32px;
    margin-top: 12px;
    margin-bottom: 10px;
  }

  img[src=''],
  img:not([src]) {
    opacity: 0;
  }
}

.open-wrapper {
  width: auto !important;
  overflow: auto !important;
}
</style>
