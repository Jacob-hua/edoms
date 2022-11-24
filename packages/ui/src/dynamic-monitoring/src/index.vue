<template>
  <BusinessCard
    title="动环监测"
    :class="wrapperClassName"
    subtitle="DYNAMIC MONITORING"
    min-width="500"
    min-height="200"
  >
    <template #operation>
      <div class="operation" @click="handleTrigger">展开</div>
    </template>
    <div class="dynamic-monitoring">
      <div v-for="({ icon, parameter, label }, index) in indicators" :key="index">
        <img :src="icon" />
        <div>{{ parameter }}</div>
        <div>{{ label }}</div>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import { MDynamicMonitoring, MEnvironmentIndicator, MIndicatorItemConfig } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import GasImg from './assets/gas.png';
import LiquidDepthImg from './assets/liquidDepth.png';
import MoistureImg from './assets/moisture.png';
import TemperatureImg from './assets/temperature.png';
import apiFactory from './api';

interface Indicator {
  icon: string;
  parameter: string;
  label: string;
  config: MIndicatorItemConfig;
}

const props = defineProps<{
  config: MDynamicMonitoring;
}>();

const { request } = useApp(props);

const { fetchIndicatorData } = apiFactory(request);

const indicators = ref<Indicator[]>([]);
const wrapperClassName = ref<string>('');

const updateIndicatorsData = async () => {
  const result = await fetchIndicatorData({
    sysInsCode: '',
    dataList: [],
  });
  result.forEach(({ dataValue, deviceCode, propCode }) => {
    const targetIndicator = indicators.value.find(
      (indicator) => indicator.config.instance === deviceCode && indicator.config.property === propCode
    );
    targetIndicator && (targetIndicator.parameter = `${dataValue}`);
  });
};

useIntervalAsync(() => {
  updateIndicatorsData();
}, 10000);

watchEffect(() => {
  indicators.value = props.config.indicators?.reduce(
    (indicators, config) => [
      ...indicators,
      { label: config.label, parameter: '-', icon: getIconByIndicatorType(config.type), config },
    ],
    [] as Indicator[]
  );
});

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
</script>

<style lang="scss" scoped>
.dynamic-monitoring {
  display: flex;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.open-wrapper {
  background-color: red;
  width: auto !important;
  overflow: auto !important;
}
</style>
