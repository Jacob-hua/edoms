<template>
  <div class="dynamic-monitoring-container">
    <BusinessCard
      title="动环监测"
      :class="wrapperClassName"
      subtitle="DYNAMIC MONITORING"
      min-width="392"
      min-height="160"
    >
      <template #operation>
        <div :class="operatable" @click="handleTrigger">...</div>
      </template>
      <div class="dynamic-monitoring">
        <div v-for="(item, index) in initIndicators" :key="index" @click="handleDisplayCharts(item)">
          <img :src="item.icon" />
          <div :class="item.parameterClass">{{ item.displayParameter }}</div>
          <div class="label">{{ item.label }}</div>
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
      :width="960"
      :height="480"
      :options="options"
      @date-change="handleDateChange"
    ></EChartsDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatDateRange, formatPrecision, stringToDate } from '@edoms/utils';

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
  parameterClass: string[];
  label: string;
  deviceCode: string;
  propCode: string;
  unit: string;
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
const wrapperClassName = ref<string>('');

const dialogTitle = ref<string>('');
const options = ref<ECOption>({});

const restParamVisible = ref<boolean>(false);
const chartDialogVisible = ref<boolean>(false);

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

const operatable = computed(() => (restIndicators.value.length ? 'operation' : 'dis-operation'));

watch(
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs.map(({ label, type, instance, property, unit }) => ({
      label,
      parameter: '',
      displayParameter: '',
      parameterClass: ['parameter'],
      icon: getIconByIndicatorType(type),
      deviceCode: instance[instance.length - 1],
      propCode: property,
      unit: unit,
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
    const targetIndex = indicatorConfigs.value.findIndex(
      ({ instance, property }) => instance[instance.length - 1] === deviceCode && property === propCode
    );
    if (targetIndex < 0) {
      return;
    }
    const indicatorConfig = indicatorConfigs.value[targetIndex];
    const indicator = indicators.value[targetIndex];
    indicator.parameter = dataValue + '';
    indicator.displayParameter = `${String(formatPrecision(dataValue, indicatorConfig.precision))} ${
      indicatorConfig.unit
    }`;
    indicator.parameterClass = calculateParameterClassName(indicator, indicatorConfig);
    indicator.deviceCode = deviceCode;
    indicator.propCode = propCode;
    indicator.unit = indicatorConfig.unit;
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

function calculateParameterClassName(indicator: Indicator, config: MIndicatorItemConfig) {
  const { expectedMax, expectedMin, targetMax, targetMin } = config;
  const parameter = Number(indicator.parameter);
  const result = ['parameter'];
  if (parameter >= expectedMin && parameter <= expectedMax) {
    result.push('parameter-normal');
  } else if (parameter >= targetMin && parameter <= targetMax) {
    result.push('parameter-warn');
  } else {
    result.push('parameter-danger');
  }
  return result;
}

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
      valueFormatter: (value) => `${value}${activeIndicator.value?.unit}`,
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      name: `单位：${activeIndicator.value?.unit}`,
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series,
  };
};

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

  const chartSeries = result.map(({ dataList }) => ({
    name: activeIndicator.value?.label,
    type: 'line',
    showSymbol: false,
    data: dataList.map(({ time, value }) => [stringToDate(time), value]),
  }));
  options.value = generateOption(chartSeries);
  console.log(result);
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
  getHistoryData(stringToDate(value));
};
</script>

<style lang="scss" scoped>
.dynamic-monitoring-container {
  display: flex;
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
  align-self: center;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 72px;
    height: 90px;

    .parameter {
      font-size: 14px;
      margin-bottom: 8px;
      width: 100%;
      text-align: center;
      font-weight: bold;
    }

    .parameter-normal {
      color: #00ff00;
    }

    .parameter-warn {
      color: #ff9b00;
    }

    .parameter-danger {
      color: #ff4700;
    }

    .label {
      font-size: 14px;
      font-weight: bold;
    }
  }

  img {
    width: 32px;
    height: 32px;
    margin-top: 12px;
    margin-bottom: 10px;
  }
}

.open-wrapper {
  width: auto !important;
  overflow: auto !important;
}
</style>
