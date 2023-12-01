<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="141">
      <template #operation>
        <div class="operation" @click="handleShowMore">
          <img :style="'transform: rotateZ(90deg)'" src="../../../assets/image/arrow_up.png" alt="" />
        </div>
      </template>
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

import { formatDate, formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import EletricImg from './assets/a-dianfei1.svg';
import ConsumpImg from './assets/yongdianliang.svg';
import CostImg from './assets/zhilengchengben.svg';
import ColdImg from './assets/zhilengliang.svg';
import apiFactory from './api';
import { MEconomicIndicator, MEconomicIndicators } from './type';

export interface Indicator {
  icon: string;
  parameter: string | number;
  label: string;
  propCode: string;
  code: string;
  unit: string;
  precision: string;
}

const props = defineProps<{
  config: MEconomicIndicators;
}>();

const { request, eventComMethods } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

const indicators = ref<Indicator[]>([]);

//指标codes
const indicatorProperty = computed(() =>
  props.config.indicators?.map(({ property }: { property: string }) => property)
);

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

//能效监测
const indicatorsVisable = ref<boolean>(false);

const handleShowMore = () => {
  indicatorsVisable.value = !indicatorsVisable.value;
  eventComMethods['changeIndicatorsVisable'](indicatorsVisable.value);
};

const updateRealData = async () => {
  if (!indicatorProperty.value || indicatorProperty.value.length <= 0) return;

  const time = formatDate(new Date(), 'YYYY-MM-DD');
  const result = await fetchExecuteApi({
    apiCode: 'queryEconomicIndicators',
    requestParam: {
      time,
      codes: indicatorProperty.value.slice(0, 2).join(','),
    },
  });
  if (!result) return;
  Object.keys(result).forEach((code: string) => {
    indicators.value.forEach((item) => {
      if (item.propCode === code) {
        item.parameter = formatPrecision(result[code], item.precision);
      }
      if (item.code === code) {
        item.parameter = formatPrecision(result[code], item.precision);
      }
    });
  });
};

const getIconByIndicatorType = (type: MEconomicIndicator) => {
  const iconClassify = {
    [MEconomicIndicator.ELECTRICITY_CONSUMPTION]: EletricImg,
    [MEconomicIndicator.ELECTRIC]: ConsumpImg,
    [MEconomicIndicator.COLD_COST]: CostImg,
    [MEconomicIndicator.REFRIGERATION_CAPACITY]: ColdImg,
  };
  return iconClassify[type];
};

watch(
  () => props.config.indicators,
  (indicatorConfigs) => {
    indicators.value = indicatorConfigs?.map(({ label, type, property, unit, precision, code }) => ({
      label,
      parameter: '',
      icon: getIconByIndicatorType(type),
      propCode: property,
      unit,
      precision,
      code,
    }));
  },
  {
    immediate: true,
  }
);

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
