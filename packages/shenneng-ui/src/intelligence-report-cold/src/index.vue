<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-27 10:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-10 14:35:10
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
      <div class="header">
        <img src="./assets/dialog_icon_report.png" alt="" class="icon-report" />
        <div class="label">{{ config.title }}</div>
        <div class="close" @click="showReport = false"></div>
      </div>
      <div class="scroll-table">
        <div class="day-table">
          <Table :config="config" :type="'day'"></Table>
        </div>
        <div class="month-table">
          <Table :config="config" :type="'month'"></Table>
        </div>
        <div class="retrieval-table">
          <RetrievalTable :config="config" @show-detail-table="showDetailTable"></RetrievalTable>
        </div>
      </div>
    </div>
    <div v-if="showDetail" class="detail-table">
      <DetailTable :config="config" :column-index="columnIndex" @close-detail-table="showDetail = false"></DetailTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import DetailTable from './component/DetailTable.vue';
import RetrievalTable from './component/RetrievalTable.vue';
import Table from './component/Table.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MIntelligenceReport } from './type';

const props = defineProps<{
  config: MIntelligenceReport;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData } = apiFactory(request);

const showReport = ref<boolean>(false);
const showDetail = ref<boolean>(false);
const columnIndex = ref<number>(0);

const changeReport = () => {
  showReport.value = true;
};

const showDetailTable = (index: number) => {
  showDetail.value = true;
  columnIndex.value = index;
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
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
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
    width: 1720px;
    height: 945px;
    background: rgba($color: #000000, $alpha: 0.9);
    border: 1px solid #013460;
    .header {
      position: relative;
      width: 100%;
      min-height: 52px;
      display: flex;
      align-items: center;
      background: url(./assets/bg_header.png);
      background-size: cover;
      .icon-report {
        width: 22px;
        height: 24px;
        margin-left: 21px;
        margin-right: 16px;
        background: url(./assets/dialog_icon_report.png);
        background-size: cover;
      }
      .label {
        color: #eaf5ff;
        font-size: 18px;
        font-weight: 400;
      }
      .close {
        position: absolute;
        right: 20px;
        top: 19px;
        width: 14px;
        height: 14px;
        cursor: pointer;
        background: url(./assets/icon_close.png);
        background-size: cover;
      }
    }
    .scroll-table {
      width: 100%;
      height: 873px;
      overflow-x: hidden;
      overflow-y: scroll;
      .day-table {
        margin-left: 20px;
        margin-top: 20px;
        width: 1680px;
        height: 338px;
        background: rgba(9, 15, 23, 0.3);
        border: 1px solid #212c3c;
      }

      .month-table {
        margin-left: 20px;
        margin-top: 20px;
        width: 1680px;
        height: 338px;
        background: rgba(9, 15, 23, 0.3);
        border: 1px solid #212c3c;
      }
      .retrieval-table {
        margin-left: 20px;
        margin-top: 20px;
        width: 1680px;
        height: 385px;
        background: rgba(9, 15, 23, 0.3);
        border: 1px solid #212c3c;
      }
    }
  }
  .detail-table {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 840px;
    height: 710px;
    background: #000000;
    border: 1px solid #013460;
    z-index: 10;
  }
}
</style>
