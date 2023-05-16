<template>
  <div class="wrap-suspended" style="min-width: 214px; min-height: 45px">
    <div class="wrap-trigger">
      <div class="wrap-window">
        <div v-for="(item, index) in initIndicators" :key="item.label" class="wrap-list">
          <div class="label overflow-ellipsis">{{ item.label }}</div>
          <div :class="index % 2 == 0 ? 'green' : 'red'" class="wrap-val">
            <div class="val">{{ item.parameter }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import { MIndicatorItemConfig, MSuspendedWindow } from './type';

export interface Indicator {
  parameter: string;
  label: string;
  deviceCode: string;
  propCode: string;
  unit: string;
  precision: string;
  value: string | number;
}

const props = defineProps<{
  config: MSuspendedWindow;
}>();

const { request } = useApp(props);

// const { fetchIndicatorData } = apiFactory(request);
const { fetchRealData } = apiFactory(request);

const initIndicators = ref<Indicator[]>([]);

// const magictype = ref<string>('line');

const indicatorConfigs = computed<MIndicatorItemConfig[]>(() => props.config.indicators ?? []);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});
const getRandomValue = () => {
  return (Math.random() * 100).toFixed(2);
};

watch(
  () => indicatorConfigs.value,
  (indicatorConfigs) => {
    initIndicators.value = indicatorConfigs.map(({ label, instance, property, unit, precision }) => ({
      label,
      value: getRandomValue(),
      parameter: '',
      deviceCode: instance[instance.length - 1],
      propCode: property,
      unit: unit,
      precision: precision,
    }));
  },
  {
    immediate: true,
  }
);

const updateIndicatorsData = async () => {
  const dataCodes: string[] = indicatorConfigs.value.map((item: any) => item.property);

  if (dataCodes.length === 0) {
    return;
  }

  const result = await fetchRealData({ dataCodes });

  result.forEach(({ propCode, propVal }) => {
    const targetIndexs: number[] = [];
    indicatorConfigs.value.forEach(({ property }, index) => {
      if (property === propCode) {
        targetIndexs.push(index);
      }
    });
    if (targetIndexs.length === 0) {
      return;
    }
    targetIndexs.forEach((targetIndex) => {
      const indicatorConfig = indicatorConfigs.value[targetIndex];
      const indicator = initIndicators.value[targetIndex];
      indicator.parameter = formatPrecision(Number(propVal), indicatorConfig.precision);
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-suspended {
  position: relative;
  .wrap-trigger {
    position: relative;
    width: 100%;
    height: 100%;

    .wrap-window {
      opacity: 0;
      position: absolute;
      bottom: 102%;
      width: 100%;
      max-height: 225px;
      overflow-x: hidden;
      overflow-y: auto;
      background: rgba(12, 16, 21, 0.92);
      border: 1px solid #022e46;
      .wrap-list {
        width: 100%;
        min-height: 45px;
        display: flex;
        align-items: center;
        .label {
          box-sizing: border-box;
          width: 56%;
          text-align: right;
          padding-left: 23px;
          padding-right: 12px;
          font-weight: 300;
          color: #00fff0;
          font-size: 12px;
        }
        .overflow-ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wrap-val {
          width: 44%;
          .val {
            width: 73%;
            min-height: 28px;
            background: rgba(24, 38, 45, 0.8);
            border: 1px solid #aaaaaa;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .green {
          color: rgba(69, 205, 37, 1);
        }
        .red {
          color: rgba(215, 40, 36, 1);
        }
      }
    }
  }
  .wrap-trigger:hover .wrap-window {
    opacity: 1;
  }
}
</style>
