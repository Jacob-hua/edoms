<template>
  <div class="wrap-suspended" style="min-width: 214px; min-height: 45px">
    <div class="wrap-trigger">
      <div class="wrap-window">
        <div v-for="(item, index) in initIndicators" :key="item.label" class="wrap-list">
          <div class="label overflow-ellipsis">{{ item.label }}</div>
          <div :class="index % 2 == 0 ? 'green' : 'red'" class="wrap-val">
            <div class="val">{{ item.value }}</div>
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
import { MIndicatorItemConfig, MSuspendedWindow, ParameterItem } from './type';

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

const { fetchIndicatorData } = apiFactory(request);

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
      const indicator = initIndicators.value[targetIndex];
      indicator.parameter = formatPrecision(dataValue, indicatorConfig.precision);
      indicator.deviceCode = deviceCode;
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap {
  /* 背景色 */
  background: transparent !important;
  border: none !important;
}
/* 下方是去除三角箭头的代码 */
.wrap[x-placement^='top'] .popper__arrow::after {
  border: none !important;
  border-bottom-color: rgba(3, 56, 106, 0.75) !important;
}

.wrap[x-placement^='top'] .popper__arrow {
  border: none !important;
  border-bottom-color: rgba(3, 56, 106, 0.75) !important;
}

:deep(.el-popper.is-light) {
  border: none !important;
  background: transparent !important;
}
// 悬浮提示组件
.el-popover {
  padding: 10px !important;
  font-size: 14px !important;
  border: none !important;
  background-color: rgba(3, 56, 106, 0.75) !important;
}
.el-popper[x-placement^='top'] .popper__arrow::after {
  border: none !important;
  //   border-top-color: rgba(3, 56, 106, 0.75) !important;
}
.el-popover.popper {
  padding: 12px 0;
}
.m-2 {
  width: 100%;
  height: 100%;
  opacity: 0;
}
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
