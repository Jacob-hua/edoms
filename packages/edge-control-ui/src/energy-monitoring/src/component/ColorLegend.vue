<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-23 09:45:06
-->
<template>
  <div class="legend-wrapper">
    <div v-for="item in legend" :key="item.name" class="legend">
      <div class="legend-top">
        <div class="color" :style="`background: ${item.data.color}`"></div>
        <div class="value" :style="`color: ${item.data.color}`">
          <span class="min"> {{ item.data.minValue }} </span>
          <span class="symbol">~</span>
          <span class="max"> {{ item.data.maxValue }}</span>
        </div>
      </div>
      <div class="legend-bottom">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import useI18n from '../../../useI18n';
import { MEnergyMonitoring } from '../type';

const { t } = useI18n();

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const legend = ref<any[]>([
  {
    name: t('中等'),
    data: {
      minValue: 1,
      maxValue: 2,
      color: '#E76A2F',
    },
  },
  {
    name: t('良好'),
    data: {
      minValue: 2,
      maxValue: 3,
      color: '#938748',
    },
  },
  {
    name: t('优异'),
    data: {
      minValue: 3,
      maxValue: 4,
      color: '#36A763',
    },
  },
]);

watch(
  () => props.config,
  (newConfig: MEnergyMonitoring) => {
    if (newConfig.medium && newConfig.medium.length > 0) legend.value[0].data = newConfig.medium[0];
    if (newConfig.good && newConfig.good.length > 0) legend.value[1].data = newConfig.good[0];
    if (newConfig.excellent && newConfig.excellent.length > 0) legend.value[2].data = newConfig.excellent[0];
  }
);

onMounted(() => {
  if (props.config.medium && props.config.medium.length > 0) {
    legend.value[0].data = props.config.medium[0];
  }
  if (props.config.good && props.config.good.length > 0) {
    legend.value[1].data = props.config.good[0];
  }
  if (props.config.excellent && props.config.excellent.length > 0) {
    legend.value[2].data = props.config.excellent[0];
  }
  //   console.log(legend.value);
});
</script>

<style lang="scss" scoped>
.legend-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .legend {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .legend-top {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50%;

      .color {
        width: 12px;
        height: 12px;
        margin-right: 10px;
        border-radius: 2px;
      }

      .value {
        font-size: 14px;
        font-weight: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .legend-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #c4e5f8;
    }
  }
}
</style>
