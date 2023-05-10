<template>
  <div style="min-width: 522px; min-height: 241px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="241">
      <div class="economic-indicators">
        <div v-for="(item, index) in initIndicators" :key="index" class="wrap-info">
          <img :src="item.icon" alt="" />
          <div class="wrap-conent">
            <div class="header">
              <span class="parameter">{{ item.parameter }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="bottom">
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
import { MEconomicIndicator, MEconomicIndicators, MIndicatorItemConfig, ParameterItem } from './type';

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

const { fetchIndicatorData } = apiFactory(request);

const indicators = ref<Indicator[]>([]);
const initIndicators = ref<Indicator[]>([]);
const restIndicators = ref<Indicator[]>([]);
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
    const targetIndexs: number[] = [];
    indicatorConfigs.value.forEach(({ instance, property }, index) => {
      if (instance[instance.length - 1] === deviceCode && property === propCode) {
        targetIndexs.push(index);
      }
    });
    if (targetIndexs.length <= 0) {
      return;
    }
    targetIndexs.forEach((targetIndex) => {
      const indicatorConfig = indicatorConfigs.value[targetIndex];
      const indicator = indicators.value[targetIndex];
      indicator.parameter = formatPrecision(dataValue, indicatorConfig.precision);
      indicator.displayParameter = `${String(formatPrecision(dataValue, indicatorConfig.precision))} ${
        indicatorConfig.unit
      }`;
      indicator.parameterStyle = calculateParameterStyle(indicator, indicatorConfig);
      indicator.deviceCode = deviceCode;
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);

function getIconByIndicatorType(type: MEconomicIndicator) {
  const iconClassify = {
    [MEconomicIndicator.ELECTRICITY_CONSUMPTION]: ConsumptionImg,
    [MEconomicIndicator.COOL_COST]: CostImg,
    [MEconomicIndicator.ELECTRIC]: ElectricImg,
    [MEconomicIndicator.COOL_ENERGY_CONSUMPTION]: ColdEnergyImg,
    [MEconomicIndicator.HEAT_COST]: CostImg,
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

// const getHistoryData = async (date: Date) => {
//   const { start, end } = formatDateRange(date, 'day', 'YYYY-MM-DD HH:mm:ss');
//   const result = await fetchHistoryData({
//     startTime: start,
//     endTime: end,
//     interval: '1h',
//     type: 'dev',
//     dataList: [
//       {
//         deviceCode: activeIndicator.value?.deviceCode ?? '',
//         propCode: activeIndicator.value?.propCode ?? '',
//       },
//     ],
//   });

//   chartSeries.value = result.map(({ dataList }, index) => ({
//     name: activeIndicator.value?.label ? activeIndicator.value.label : `未命名${index}`,
//     type: magictype.value,
//     showSymbol: false,
//     data: dataList.map(({ time, value }) => [
//       stringToDate(time),
//       formatPrecision(+value, activeIndicator.value?.precision ?? ''),
//     ]),
//     itemStyle: {
//       color: activeIndicator.value?.lineColor,
//     },
//   }));
// };

// const handleDisplayCharts = (item: Indicator) => {
//   activeIndicator.value = item;
//   dialogTitle.value = item.label;
//   getHistoryData(new Date());
//   chartDialogVisible.value = true;
// };
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
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.economic-indicators {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100%;

  .wrap-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    width: 50%;
    height: 50%;
    // background-color: red;
    img {
      width: 50px;
      height: 50px;
      margin-left: 60px;
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
        font-size: 14px;
        color: #ffffff;
        text-align: left;
        display: flex;
        align-items: center;
      }
    }
    // width: 72px;
    // margin: 4px;

    // .parameter {
    //   font-size: 14px;
    //   margin-bottom: 8px;
    //   width: 100%;
    //   text-align: center;
    //   font-weight: bold;

    //   .data-value {
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     white-space: nowrap;
    //   }
    // }

    .label {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
