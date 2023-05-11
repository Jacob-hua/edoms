<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-27 10:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-11 19:18:55
-->
<template>
  <div class="wrap-intell">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/icon_report.png" alt="" @click="changeReport" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <div v-if="showReport" class="dialog-table">
      <Table :config="config" @close-table="showReport = false"></Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import Table from './component/Table.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MIntelligenceReport } from './type';

const props = defineProps<{
  config: MIntelligenceReport;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData } = apiFactory(request);

const showReport = ref<boolean>(false);

const changeReport = () => {
  showReport.value = true;
};
const intelligenceReport = computed<MIntelligenceReport>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const updateEfficiencyData = async () => {
  if (!intelligenceReport.value.instance) {
    return;
  }
  const param: FetchEfficiencyReq = {
    insCodeList: [intelligenceReport.value.instance[intelligenceReport.value.instance.length - 1]],
    propCode: '',
  };
  const result = await fetchEfficiencyData(param);
  result.forEach(({ insCode }) => {
    if (insCode !== intelligenceReport.value.instance[intelligenceReport.value.instance.length - 1]) {
      return;
    }
  });
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-intell {
  width: 100%;
  height: 100%;
  position: relative;
  .wrap-report {
    min-width: 117px;
    min-height: 80px;
    background: rgba(0, 163, 255, 0.06);
    // border: 1px solid #051823;
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
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
      box-sizing: border-box;
      .icon-report {
        width: 22px;
        height: 24px;
        cursor: pointer;
      }
    }

    .label {
      margin-top: 5px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
  }
  .dialog-table {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1480px;
    height: 786px;
    background: rgba($color: #000000, $alpha: 0.9);
    border: 1px solid #013460;
    z-index: 10;
  }
}
</style>
