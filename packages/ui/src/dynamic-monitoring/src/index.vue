<template>
  <div>
    <div>动环监测</div>
    <div>></div>
    <div>
      <div v-for="({ icon, label }, index) in indicators" :key="index">
        <img :src="icon" />
        <div>{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { MDynamicMonitoring, MEnvironmentIndicator } from '../../types';
import useApp from '../../useApp';

import GasImg from './assets/gas.png';
import LiquidDepthImg from './assets/liquidDepth.png';
import MoistureImg from './assets/moisture.png';
import TemperatureImg from './assets/temperature.png';

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

const indicators = computed(() =>
  props.config.indicators?.reduce(
    (indicators, { type, label }) => [...indicators, { label, icon: getIconByIndicatorType(type) }],
    [] as any[]
  )
);
</script>
