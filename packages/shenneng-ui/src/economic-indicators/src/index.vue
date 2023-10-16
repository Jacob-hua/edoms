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
import { computed, ref } from 'vue';

import { formatDateRange, formatPrecision } from '@edoms/utils';

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
import Accumulated_ChargingImg from './assets/leijichongdian .png';
import Daily_ChargingImg from './assets/richongdian.png';
import Daily_TimesImg from './assets/ricishu.png';
import TemperatureImg from './assets/temperature.png';
import WaterImg from './assets/water.png';
import apiFactory from './api';
import { FetchTceStatisticsData, MEconomicIndicator, MEconomicIndicators } from './type';

export interface Indicator {
  icon?: string;
  parameter: string | number;
  label: string;
  propCode: string;
  propVal: string;
  type: string;
  unit: string;
  precision: string;
}
type SdateType = 'd' | 'm' | 'y';

const props = defineProps<{
  config: MEconomicIndicators;
}>();

const { request } = useApp(props);

const { fetchTceStatisticsData } = apiFactory(request);

const initIndicators = ref();

const instanceCode = computed(() => props.config.instance?.[0]);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const transDateMap = (date: SdateType): any =>
  new Map([
    ['d', 'day'],
    ['m', 'month'],
    ['y', 'year'],
  ]).get(date);

const updateRealData = async () => {
  const dataCodes = instanceCode.value;
  if (dataCodes && dataCodes.length === 0) {
    return;
  }
  const { start, end } = formatDateRange(new Date(), transDateMap(props.config.specificDate), 'YYYY-MM-DD HH:mm:ss');
  const params = {
    startAt: start,
    endAt: end,
    propCode: instanceCode.value,
    jsonRule: props.config.jsonRule,
  };
  const result = await fetchTceStatisticsData(params);
  initIndicators.value = result?.map(({ label, propVal, unit, precision, type }: FetchTceStatisticsData) => {
    return {
      label,
      unit,
      icon: getIconByIndicatorType(type as MEconomicIndicator),
      parameter: isNaN(Number(propVal)) ? propVal : formatPrecision(Number(propVal), precision as string | number),
      propCode: instanceCode.value,
      precision: precision as string,
    };
  });
};

const getIconByIndicatorType = (type: MEconomicIndicator) => {
  const iconClassify = {
    [MEconomicIndicator.ELECTRICITY_CONSUMPTION]: ConsumptionImg,
    [MEconomicIndicator.COST]: CostImg,
    [MEconomicIndicator.ELECTRIC]: ElectricImg,
    [MEconomicIndicator.COOL_ENERGY_CONSUMPTION]: ColdEnergyImg,
    [MEconomicIndicator.HEAT_ENERGY_CONSUMPTION]: HeatEnergyImg,
    [MEconomicIndicator.TEMPERATURE]: TemperatureImg,
    [MEconomicIndicator.HUMIDITY]: HumidityImg,
    [MEconomicIndicator.EXPOSURE]: ExposureImg,
    [MEconomicIndicator.WATER_CONSUMPTION]: WaterImg,
    [MEconomicIndicator.Accumulated_Charging_apacity]: Accumulated_ChargingImg,
    [MEconomicIndicator.Daily_Charging_apacity]: Daily_ChargingImg,
    [MEconomicIndicator.Daily_Charging_Times]: Daily_TimesImg,
  };
  return iconClassify[type];
};

useIntervalAsync(updateRealData, intervalDelay.value);
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
    max-width: 50%;

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
