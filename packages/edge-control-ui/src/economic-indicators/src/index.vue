<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="141">
      <div class="economic-indicators">
        <div v-for="item in indicators" :key="item.label" class="list">
          <div class="icon">
            <img :src="item.icon" alt="" />
          </div>
          <div class="value">{{ item.parameter }}</div>
          <div class="unit">{{ item.unit }}</div>
          <div class="label">{{ item.label }}</div>
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

import EletricImg from './assets/a-dianfei1.svg';
import ConsumpImg from './assets/yongdianliang.svg';
import CostImg from './assets/zhilengchengben.svg';
import ColdImg from './assets/zhilengliang.svg';
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

// const list: any = ref([
//   {
//     label: '用电量',
//     value: 5846,
//     unit: '元/kWh',
//   },
//   {
//     label: '制冷量',
//     value: 5846,
//     unit: 'kWh',
//   },
//   {
//     label: '电费',
//     value: 5846,
//     unit: '元',
//   },
//   {
//     label: '制冷成本',
//     value: 5846,
//     unit: '元/kWh',
//   },
// ]);

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
      indicator.parameter = isNaN(Number(propVal))
        ? propVal
        : formatPrecision(Number(propVal), indicatorConfig.precision);
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateRealData, intervalDelay.value);

function getIconByIndicatorType(type: MEconomicIndicator) {
  const iconClassify = {
    [MEconomicIndicator.ELECTRICITY_CONSUMPTION]: EletricImg,
    [MEconomicIndicator.ELECTRIC]: ConsumpImg,
    [MEconomicIndicator.COLD_COST]: CostImg,
    [MEconomicIndicator.REFRIGERATION_CAPACITY]: ColdImg,
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
  background-color: #272d36;
  // flex-wrap: wrap;
  // align-items: center;
  // height: 100%;
  .list {
    margin-top: 15px;
    width: 25%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    .icon {
      width: 26px;
      height: 26px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .value {
      min-height: 14px;
      color: #00ff00;
      margin-top: 8px;
      margin-bottom: 8px;
      font-weight: bold;
      width: 100%;
      text-align: center;
    }

    .unit {
      min-height: 14px;
      color: #00ff00;
      font-weight: bold;
      width: 100%;
      text-align: center;
      margin-bottom: 8px;
    }

    .label {
      color: rgba(#fff, 0.65);
    }
  }
}
</style>
