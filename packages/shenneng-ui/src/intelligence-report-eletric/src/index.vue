<template>
  <div class="wrap-intell" @click="changeReport">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/icon_report.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <div v-if="showReport" class="dialog-table">
      <Table
        :config="config"
        :table-data="tableData"
        :table-header="tableHeader"
        @close-table="showReport = false"
        @change-time="handleChangeTime"
      >
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { formatDate } from '@edoms/utils';

import useApp from '../../useApp';

import Table from './component/Table.vue';
import apiFactory from './api';
import locales from './locales';
import { MIntelligenceReport } from './type';

const props = defineProps<{
  config: MIntelligenceReport;
}>();

const { setMessage } = useApp(props);
setMessage(locales);

const { request } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

const showReport = ref<boolean>(false);

const instanceCode = computed(() =>
  props.config.classify?.map(({ instance }: { instance: string[] }) => instance.pop())
);

const instanceName = computed(() =>
  props.config.classify?.map(({ instanceName }: { instanceName: string }) => instanceName)
);

const changeReport = () => (showReport.value = true);

// Query Table data
const tableData = ref();
const tableHeader = ref();
const page = ref({
  page: 1,
  size: 5,
});

const getIntelligenceData = async (time: string = formatDate(new Date(), 'YYYY-MM-DD')) => {
  if (!props.config || instanceCode.value?.length <= 0) return;
  const params = { devCodes: instanceCode.value, time, devNames: instanceName.value, ...page.value };
  const result = await fetchExecuteApi({ apiCode: 'querySmartReport', requestParam: params });
  if (!result || result.dataList.length <= 0) return;
  //构造表头
  tableHeader.value = result.dataList?.map((item, index) => {
    const currentItem: Record<string, any> = {};
    currentItem.name = item.devInsName;
    currentItem[`dev${index}`] = Object.keys(item.data);
    return currentItem;
  });
  //构造表格数据
  const dataKey: Record<string, any> = result.dataList[0].data;
  const dataKeyArr = Object.keys(dataKey);
  const timeskey = Object.keys(dataKey[dataKeyArr[0]]);
  tableData.value = timeskey.map((item) => {
    const currentItem: Record<string, any> = {};
    currentItem.time = item;
    result.dataList.forEach((cur, index) => {
      dataKeyArr.forEach((key: string) => {
        currentItem[`dev${index}` + key] = cur.data[key][item];
      });
    });
    return currentItem;
  });
};

// Change time
const handleChangeTime = (time: string) => {
  getIntelligenceData(time);
};

onMounted(() => {
  instanceCode.value && getIntelligenceData();
});
</script>

<style lang="scss" scoped>
.wrap-intell {
  min-width: 117px;
  min-height: 80px;
  position: relative;

  .wrap-report {
    width: 100%;
    height: 100%;
    // background: rgba(0, 163, 255, 0.06);
    // border: 1px solid #051823;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .wrap-icon {
      width: 60px;
      height: 42px;
      margin-top: 1px;
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
      }
    }

    .label {
      margin-top: 7px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
  }

  .dialog-table {
    // position: fixed;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
    // width: 1480px;
    // height: 786px;
    // background: rgba($color: #000000, $alpha: 0.9);
    // border: 1px solid #013460;
    // z-index: 15;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
  }
}
</style>
