<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-06-05 17:23:12
-->
<template>
  <div style="min-width: 522px; min-height: 246px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="246">
      <div class="wrap-body">
        <div class="left">
          <div class="top">
            <ActualCard :config="config" :actual-value="actualValue"></ActualCard>
          </div>
          <div class="line"></div>
          <div class="bottom">
            <LevelCard :config="config" :actual-value="actualValue"></LevelCard>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <LinearCard :config="config" :actual-value="actualValue"></LinearCard>
          </div>
          <div class="line"></div>
          <div class="bottom">
            <ColorLegend :config="config"></ColorLegend>
          </div>
        </div>
      </div>
    </BusinessCard>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import ActualCard from './component/ActualCard.vue';
import ColorLegend from './component/ColorLegend.vue';
import LevelCard from './component/LevelCard.vue';
import LinearCard from './component/LinearCard.vue';
import apiFactory from './api';
import locales from './locales';
import { MEnergyMonitoring } from './type';

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const { request, setMessage } = useApp(props);

const { fetchRealData } = apiFactory(request);

setMessage(locales);

const actualValue = ref<number>(0);
const energyConfig = computed<MEnergyMonitoring>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const updateEfficiencyData = async () => {
  if (!energyConfig.value.instance) {
    return;
  }
  const dataCodes: string[] = [energyConfig.value.property];

  if (dataCodes.length === 0) {
    return;
  }

  const result = await fetchRealData({ dataCodes });
  result.forEach(() => {
    // actualValue.value = +formatPrecision(Number(propVal), energyConfig.value.precision);
    // console.log(energyConfig.value.precision);
    actualValue.value = +formatPrecision(Math.random() * 7, energyConfig.value.precision);
  });
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-body {
  width: 100%;
  min-height: 205px;
  display: flex;
  .left {
    height: calc(100% - 41px);
    min-width: 124px;
    width: 24%;
    // height: 164px;
    margin-left: 20px;
    margin-top: 21px;
    background: rgba($color: #00a3ff, $alpha: 0.08);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .top {
      width: 100%;
      height: 49.5%;
    }
    .line {
      //   margin-left: 10.5px;
      width: calc(100% - 21px);
      height: 1px;
      background: rgba($color: #00a3ff, $alpha: 0.2);
    }
    .bottom {
      width: 100%;
      height: 49.5%;
    }
  }
  .right {
    margin: 25px 32px 28px 30px;
    flex-grow: 1;
    height: calc(100% - 53px);
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      flex: 2;
    }
    .line {
      width: 100%;
      height: 1px;
      background: rgba($color: #00a3ff, $alpha: 0.2);
    }
    .bottom {
      width: 100%;
      flex: 1;
    }
  }
}
</style>
