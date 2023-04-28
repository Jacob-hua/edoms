<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-27 10:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 11:01:30
-->
<template>
  <div class="wrap-report">
    <div class="wrap-icon">
      <img class="icon-report" src="./assets/icon_report.png" alt="" @click="showReport = true" />
    </div>
    <div class="label">{{ config.name }}</div>
  </div>
  <div v-if="showReport" class="dialog-table">
    <Table :config="config"></Table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import Table from './component/Table.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MEnergyMonitoring } from './type';

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData } = apiFactory(request);

const showReport = ref<boolean>(false);
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
  const param: FetchEfficiencyReq = {
    insCodeList: [energyConfig.value.instance[energyConfig.value.instance.length - 1]],
    propCode: 'COP',
  };
  const result = await fetchEfficiencyData(param);
  result.forEach(({ insCode }) => {
    if (insCode !== energyConfig.value.instance[energyConfig.value.instance.length - 1]) {
      return;
    }
  });
  console.log(result);
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-report {
  min-width: 117px;
  min-height: 80px;
  background: rgba(0, 163, 255, 0.06);
  border: 1px solid #051823;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .wrap-icon {
    width: 60px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-report {
      width: 22px;
      height: 24px;
      cursor: pointer;
    }
  }

  .label {
    font-size: 14px;
    color: #ffffff;
    font-weight: 300;
  }
}
.dialog-table {
  min-width: 1480px;
  min-height: 786px;
  background: #000000;
  border: 1px solid #013460;
}
</style>
