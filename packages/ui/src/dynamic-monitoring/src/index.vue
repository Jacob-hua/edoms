<template>
  <BusinessCard
    title="动环监测"
    :class="wrapperClassName"
    subtitle="DYNAMIC MONITORING"
    min-width="480"
    min-height="200"
  >
    <template #operation>
      <div class="operation" @click="handleTrigger">...</div>
    </template>
    <div class="dynamic-monitoring">
      <div v-for="({ icon, displayParameter, parameterClass, label }, index) in indicators" :key="index">
        <img :src="icon" />
        <div :class="parameterClass">{{ displayParameter }}</div>
        <div class="label">{{ label }}</div>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { MDynamicMonitoring, MEnvironmentIndicator, MIndicatorItemConfig } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import GasImg from './assets/gas.svg';
import LiquidDepthImg from './assets/liquidDepth.svg';
import MoistureImg from './assets/moisture.svg';
import TemperatureImg from './assets/temperature.svg';
import apiFactory, { ParameterItem } from './api';

interface Indicator {
  icon: string;
  parameter: string;
  displayParameter: string;
  parameterClass: string[];
  label: string;
}

const props = defineProps<{
  config: MDynamicMonitoring;
}>();

const { request } = useApp(props);

const { fetchIndicatorData } = apiFactory(request);

const indicators = ref<Indicator[]>([]);
const wrapperClassName = ref<string>('');

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

watch(
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs.map(({ label, type }) => ({
      label,
      parameter: '',
      displayParameter: '',
      parameterClass: ['parameter'],
      icon: getIconByIndicatorType(type),
    }));
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
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);

const handleTrigger = () => {
  wrapperClassName.value = wrapperClassName.value === '' ? 'open-wrapper' : '';
};

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
</script>

<style lang="scss" scoped>
.operation {
  font-size: 36px;
  cursor: pointer;
  position: relative;
  top: -14px;
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

    .parameter {
      font-size: 14px;
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
  }
  img {
    width: 50px;
    height: 100px;
  }
}
.open-wrapper {
  width: auto !important;
  overflow: auto !important;
}
</style>
