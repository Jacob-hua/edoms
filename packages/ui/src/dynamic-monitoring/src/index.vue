<template>
  <BusinessCard title="动环监测" subtitle="DYNAMIC MONITORING" min-width="500" min-height="200">
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

import GasImg from './assets/gas.png';
import LiquidDepthImg from './assets/liquidDepth.png';
import MoistureImg from './assets/moisture.png';
import TemperatureImg from './assets/temperature.png';

interface Indicator {
  icon: string;
  parameter: string;
  label: string;
  config: MIndicatorItemConfig;
}

const props = defineProps<{
  config: MDynamicMonitoring;
}>();

useApp(props);

const indicators = ref<Indicator[]>([]);

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
  console.log('展开卡片');
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
</style>
