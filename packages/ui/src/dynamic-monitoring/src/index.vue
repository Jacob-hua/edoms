<template>
  <div class="business-card">
    <section class="header">
      <div class="title">动环监测</div>
      <div class="subtitle">DYNAMIC MONITORING</div>
      <div class="operation">></div>
    </section>
    <section class="body">
      <div class="dynamic-monitoring">
        <div v-for="({ icon, parameter, label }, index) in indicators" :key="index">
          <img :src="icon" />
          <div>{{ parameter }}</div>
          <div>{{ label }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

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

const getIconByIndicatorType = (type: MEnvironmentIndicator) => {
  const iconClassify = {
    [MEnvironmentIndicator.GAS]: GasImg,
    [MEnvironmentIndicator.LIQUID_DEPTH]: LiquidDepthImg,
    [MEnvironmentIndicator.MOISTURE]: MoistureImg,
    [MEnvironmentIndicator.TEMPERATURE]: TemperatureImg,
  };
  return iconClassify[type];
};

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
</script>

<style lang="scss" scoped>
.business-card {
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 130px;
}

.header {
  height: 20px;
  display: flex;
}

.dynamic-monitoring {
  display: flex;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
