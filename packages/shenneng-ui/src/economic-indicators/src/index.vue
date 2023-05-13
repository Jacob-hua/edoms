<template>
  <div style="min-width: 522px; min-height: 141px">
    <BusinessCard :config="config" min-width="522" min-height="141">
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

// import GasImg from './assets/gas.svg';
// import LiquidDepthImg from './assets/liquidDepth.svg';
// import MoistureImg from './assets/moisture.svg';
// import TemperatureImg from './assets/temperature.svg';
import ConsumptionImg from './assets/consumption.png';
import CostImg from './assets/cost.png';
import ElectricImg from './assets/electric.png';
import ColdEnergyImg from './assets/energy.png';
import HeatEnergyImg from './assets/heat_energy.png';
import apiFactory from './api';
import { MEconomicIndicator, MEconomicIndicators, MIndicatorItemConfig } from './type';

export interface Indicator {
  icon: string;
  parameter: string | number;
  displayParameter: string;
  parameterStyle: {};
  label: string;
  deviceCode: string;
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
const restIndicators = ref<Indicator[]>([]);
// const cssBackgroundColor = computed<string>(() =>
//   props.config.style?.backgroundColor ? props.config.style?.backgroundColor : 'rgba(31, 30, 29, 1)'
// );
// const activeIndicator = ref<Indicator>();

// const dialogTitle = ref<string>('');
// const options = ref<ECOption>({});

// const chartSeries = ref<any[]>([]);

const chartDialogVisible = ref<boolean>(false);
const selectDate = ref(new Date());

// const magictype = ref<string>('line');

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
    indicators.value = indicatorConfigs.map(({ label, type, instance, property, unit, precision }) => ({
      label,
      parameter: Math.floor(Math.random() * 10000),
      displayParameter: '',
      parameterStyle: { color: '#00ff00' },
      icon: getIconByIndicatorType(type),
      deviceCode: instance[instance.length - 1],
      propCode: property,
      unit: unit,
      precision: precision,
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
      indicator.displayParameter = `${String(formatPrecision(Number(propVal), indicatorConfig.precision))} ${
        indicatorConfig.unit
      }`;
      indicator.parameterStyle = calculateParameterStyle(indicator, indicatorConfig);
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
    // [MEconomicIndicator.HEAT_COST]: CostImg,
    [MEconomicIndicator.HEAT_ENERGY_CONSUMPTION]: HeatEnergyImg,
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.economic-indicators {
  //   background-color: v-bind(cssBackgroundColor);
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
    min-width: 261px;
    min-height: 100px;
    // background-color: red;
    img {
      width: 50px;
      height: 50px;
      margin-left: 40px;
    }
    .wrap-conent {
      padding-left: 15px;
      width: 60%;
      height: 50%;
      //   background-color: green;
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
