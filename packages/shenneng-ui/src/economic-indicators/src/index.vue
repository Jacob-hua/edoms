<template>
  <div style="min-width: 522px; min-height: 141px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="141">
      <div class="economic-indicators">
        <div v-for="(item, index) in initIndicators" :key="index" class="wrap-info">
          <img :src="item.icon" alt="" />
          <div class="wrap-conent">
            <div class="header">
              <span class="parameter">{{ item.parameter }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="bottom overflow-ellipsis">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </BusinessCard>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import CostImg from './assets/cost.png';
import ElectricImg from './assets/electric.png';
import ColdEnergyImg from './assets/energy.png';
import ConsumptionImg from './assets/energy_consumption.png';
import ExposureImg from './assets/exposure.png';
import HeatEnergyImg from './assets/heat_energy.png';
import HumidityImg from './assets/humidity.png';
import TemperatureImg from './assets/temperature.png';
import apiFactory from './api';
import { MEconomicIndicator, MEconomicIndicators, MIndicatorItemConfig } from './type';

export interface Indicator {
  icon: string;
  parameter: string | number;
  label: string;
  propCode: string;
  unit: string;
  precision: string;
}

const props = defineProps<{
  config: MEconomicIndicators;
}>();

const { request } = useApp(props);

const { fetchRealData } = apiFactory(request);

const indicators = ref<Indicator[]>([]);
const initIndicators = ref<Indicator[]>([]);

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

watch(
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs.map(({ label, type, property, unit, precision }) => ({
      label,
      parameter: '',
      icon: getIconByIndicatorType(type),
      propCode: property,
      unit: unit,
      precision: precision,
    }));
    initIndicators.value = indicators.value;
  },
  {
    immediate: true,
  }
);

const updateRealData = async () => {
  const dataCodes: string[] = indicatorConfigs.value.map(({ property }): string => property);

  if (dataCodes.length === 0) {
    return;
  }

  const result = await fetchRealData({ dataCodes });
  result.forEach(({ propVal, propCode }) => {
    const targetIndexs: number[] = [];
    indicatorConfigs.value.forEach(({ property }, index) => {
      if (property === propCode) {
        targetIndexs.push(index);
      }
    });
    if (targetIndexs.length <= 0) {
      return;
    }
    targetIndexs.forEach((targetIndex) => {
      const indicatorConfig = indicatorConfigs.value[targetIndex];
      const indicator = indicators.value[targetIndex];
      indicator.parameter = formatPrecision(Number(propVal), indicatorConfig.precision);
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateRealData, intervalDelay.value);

function getIconByIndicatorType(type: MEconomicIndicator) {
  const iconClassify = {
    [MEconomicIndicator.ELECTRICITY_CONSUMPTION]: ConsumptionImg,
    [MEconomicIndicator.COST]: CostImg,
    [MEconomicIndicator.ELECTRIC]: ElectricImg,
    [MEconomicIndicator.COOL_ENERGY_CONSUMPTION]: ColdEnergyImg,
    [MEconomicIndicator.HEAT_ENERGY_CONSUMPTION]: HeatEnergyImg,
    [MEconomicIndicator.TEMPERATURE]: TemperatureImg,
    [MEconomicIndicator.HUMIDITY]: HumidityImg,
    [MEconomicIndicator.EXPOSURE]: ExposureImg,
  };
  return iconClassify[type];
}
</script>

<style lang="scss" scoped>
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.economic-indicators {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .wrap-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    min-width: 259px;
    min-height: 100px;
    img {
      width: 50px;
      height: 50px;
      margin-left: 40px;
    }
    .wrap-conent {
      padding-left: 15px;
      width: 60%;
      height: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: left;
      .header {
        width: 100%;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .parameter {
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
          margin-right: 10px;
        }
        .unit {
          font-size: 14px;
          color: #ffffff;
          opacity: 0.6;
        }
      }
      .bottom {
        width: 100%;
        height: 50%;
        margin-top: 10px;
        font-size: 14px;
        color: #ffffff;
        font-weight: 300;
        text-align: left;
        display: flex;
        align-items: center;
        opacity: 0.6;
      }
    }

    .label {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
