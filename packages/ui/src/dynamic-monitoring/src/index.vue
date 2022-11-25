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
import { computed, onUpdated, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import { MDynamicMonitoring, MEnvironmentIndicator, MIndicatorItemConfig } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import GasImg from './assets/gas.png';
import LiquidDepthImg from './assets/liquidDepth.png';
import MoistureImg from './assets/moisture.png';
import TemperatureImg from './assets/temperature.png';
import apiFactory, { ParameterItem } from './api';

interface Indicator {
  icon: string;
  parameter: string;
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

watch(
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs.map(({ label, type }) => ({
      label,
      parameter: '-',
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
    if (targetIndex > -1) {
      indicators.value[targetIndex].parameter = String(dataValue);
    }
  });
};

const { cancel } = useIntervalAsync(updateIndicatorsData, 2000);

onUpdated(cancel);

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
