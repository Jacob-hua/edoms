<template>
  <div ref="scaleWrapper" class="business-card">
    <div class="header">
      <div class="title">动环监测</div>
      <div class="subtitle">DYNAMIC MONITORING</div>
      <div class="operation">></div>
    </div>
    <div class="body">
      <div class="dynamic-monitoring">
        <div v-for="({ icon, parameter, label }, index) in indicators" :key="index">
          <img :src="icon" />
          <div>{{ parameter }}</div>
          <div>{{ label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';

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
const scaleWrapper = ref<Element | null>(null);
const wrapperWidth = 320;
const wrapperHeight = 160;

onMounted(() => {
  if (!scaleWrapper.value) {
    return;
  }
  new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const [wrapperEntry] = entries;
    // const targetWidth = wrapperEntry.contentRect.width;
    // const targetHeight = targetWidth / scale;

    const widthScale = (wrapperEntry.contentRect.width * 1.0) / wrapperWidth;
    const heightScale = (wrapperEntry.contentRect.height * 1.0) / wrapperHeight;
    const scale = Math.min(widthScale, heightScale);
    const originStyle = wrapperEntry.target.getAttribute('style');
    wrapperEntry.target.setAttribute(
      'style',
      `aspect-ratio:${wrapperWidth / wrapperHeight};${originStyle};height: auto;`
    );
    Array.from(wrapperEntry.target.children).forEach((element: Element) => {
      element.setAttribute(
        'style',
        `
          transform:scale(${scale});
          transform-origin: top left;
        `
      );
    });
  }).observe(scaleWrapper.value);
});

watchEffect(() => {
  indicators.value = props.config.indicators?.reduce(
    (indicators, config) => [
      ...indicators,
      { label: config.label, parameter: '-', icon: getIconByIndicatorType(config.type), config },
    ],
    [] as Indicator[]
  );
});

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
.business-card {
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 160px;
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
