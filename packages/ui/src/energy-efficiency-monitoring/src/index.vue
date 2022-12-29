<template>
  <BusinessCard title="能效监测" subtitle="ENERGY EFFICIENCY MONITORING" min-width="480" min-height="200">
    <template #operation><span class="open" @click="handleShowMore">...</span></template>
    <div class="efficiency-wrapper">
      <div class="actual-wrapper">
        <div class="actual-value">{{ efficiencyConfig.actualValue }}</div>
        <div class="actual-unit">{{ efficiencyConfig.energyName }}</div>
      </div>
      <div><Efficiency v-bind="efficiencyConfig"></Efficiency></div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';

import Efficiency from './component/Efficiency.vue';

interface EfficiencyConfig {
  /** 最小值 **/
  minValue: string;
  /** 最大值 **/
  maxValue: string;
  /** 参考值  **/
  referenceValue: string;
  /** 实际值  **/
  actualValue: string;
  /** 等分数量 **/
  bisectionNumber?: number;
  /** 开始颜色 **/
  startColor: string;
  /** 结束颜色 **/
  endColor: string;
  /** 游标颜色 **/
  cursorColor?: string;
  /** 参考线 颜色 **/
  referenceLineColor?: string;
  /** 能效名称 **/
  energyName?: string;
}

const props = defineProps<{
  config: Omit<EfficiencyConfig, 'actualValue'>;
}>();
// TODO 更改为请求接口 刷新数据
const efficiencyConfig = ref<EfficiencyConfig>({
  maxValue: '6.0',
  minValue: '2.0',
  actualValue: '4.7',
  referenceValue: '4.3',
  startColor: 'yellow',
  endColor: 'red',
  bisectionNumber: 5,
  referenceLineColor: '#fff',
  energyName: 'COP',
});
watch(
  () => props.config,
  (config) => {
    if (!config.startColor) {
      return;
    }
    efficiencyConfig.value = {
      ...config,
      actualValue: '4.7',
    };
  },
  {
    immediate: true,
  }
);
const handleShowMore = () => {};
</script>

<style lang="scss" scoped>
.open {
  font-size: 36px;
  cursor: pointer;
  position: relative;
  top: -14px;
}
.efficiency-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  .actual-wrapper {
    margin-right: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    .actual-value {
      font-size: 28px;
      font-weight: 800;
      color: greenyellow;
      margin-bottom: 10px;
    }
  }
}
</style>
