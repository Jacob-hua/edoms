<template>
  <div class="operationReport">
    <div class="time-button">
      <TimeCalendar :option="timeType"></TimeCalendar>

      <div class="button-box">
        <el-button size="small" type="primary" plain>{{ t('查询') }}</el-button>
        <el-button size="small" type="primary" plain>{{ t('导出') }}</el-button>
      </div>
    </div>

    <div class="content-box">
      <div class="my-content">
        <div class="border-number">
          <div style="height: 50%"><span class="big-number">420</span><span>kWh</span></div>
          <div style="height: 50%">{{ t('累计用电') }}</div>
        </div>

        <div>
          <div style="height: 50%"><span class="big-number">12543</span><span>元</span></div>
          <div style="height: 50%">{{ t('累计用电成本') }}</div>
        </div>
      </div>
    </div>

    <div class="eCharts">
      <div class="tit">{{ t('充电量分析') }}</div>
      <EdomsCharts class="charts" :option="option"></EdomsCharts>
    </div>

    <div class="table-inner">
      <el-table :data="tableData" size="mini" highlight-current-row height="50vh" fit style="width: 100%">
        <el-table-column :label="t('充电桩')" prop="index" align="center" />
        <el-table-column width="180" :label="t('采集时间')" prop="acTime" align="center" />
        <el-table-column :label="t('用电量')" align="center">
          <el-table-column :label="t('起始值kWh')" prop="useStartV" align="center" />
          <el-table-column :label="t('结束值kWh')" prop="useEndV" align="center" />
          <el-table-column :label="t('用电量kWh')" prop="useNum" align="center" />
          <el-table-column :label="t('用电成本')" prop="useCost" align="center" />
        </el-table-column>
        <el-table-column :label="t('反向充电量')" align="center">
          <el-table-column :label="t('起始值')" prop="chargeStartV" align="center" />
          <el-table-column :label="t('结束值')" prop="chargeEndV" align="center" />
          <el-table-column width="160" :label="t('反向充电量')" prop="chargeNum" align="center" />
          <el-table-column :label="t('收益')" prop="chargeIncome" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useI18n from '../../../useI18n';

import TimeCalendar from './TimeCalendar.vue';

const { t } = useI18n();

const timeType = ref<string>('date');
const option = ref<ECOption>({});
option.value = {
  grid: {
    top: 40,
    left: 50,
    right: 25,
    bottom: 30,
  },
  legend: {
    top: 10,
    itemWidth: 14,
    itemHeight: 2,
    textStyle: {
      color: '#EAF5FF',
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,34,52,0.9)',
    borderColor: '#204C6F',
    borderWidth: 1,
    formatter: (params: any) => {
      let tip: string = '';
      if (params != null && params.length > 0) {
        tip += '<div>';
        for (let index = 0; index < params.length; index++) {
          tip +=
            '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].name +
            '</p><p><span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
            params[index].seriesName +
            '：</span><span style="color:' +
            params[index].color +
            ';font-size: 12px;font-weight: 400;">' +
            params[index].value.straight_value +
            '</span></p>';
        }
        tip += '</div>';
      }
      return tip;
    },
  },
  dataset: {
    dimensions: ['product', 'straight_value'],
    source: [
      { product: '00:00', straight_value: 0.5 },
      { product: '01:00', straight_value: 0.5 },
      { product: '02:00', straight_value: 0.5 },
      { product: '03:00', straight_value: 0.5 },
      { product: '04:00', straight_value: 0.5 },
      { product: '05:00', straight_value: 0.5 },
      { product: '06:00', straight_value: 0.5 },
      { product: '07:00', straight_value: 0.5 },
      { product: '08:00', straight_value: 0.5 },
      { product: '09:00', straight_value: 0.7 },
      { product: '10:00', straight_value: 0.9 },
      { product: '11:00', straight_value: 1.0 },
      { product: '12:00', straight_value: 1.3 },
      { product: '13:00', straight_value: 1.3 },
      { product: '14:00', straight_value: 1.2 },
      { product: '15:00', straight_value: 1.2 },
      { product: '16:00', straight_value: 1.1 },
      { product: '17:00', straight_value: 1.5 },
      { product: '18:00', straight_value: 1.7 },
      { product: '19:00', straight_value: 1.6 },
      { product: '20:00', straight_value: 1.4 },
      { product: '21:00', straight_value: 1.3 },
      { product: '22:00', straight_value: 1.2 },
      { product: '23:00', straight_value: 1.0 },
    ],
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    name: '元/kWh',
    nameTextStyle: {
      lineHeight: 28,
      padding: [0, 20, 0, 0],
      fontSize: '10',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 300,
      color: '#D8D8D8',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#1A242B',
        width: 1,
      },
    },
  },
  color: 'rgba(40,124,231,0.6)',
  series: [
    {
      type: 'bar',
      name: t('正向充电'),
      barWidth: 14,
      barGap: 0, //柱间距离
      itemStyle: {
        borderWidth: 1,
        borderColor: '#287CE7',
      },
    },
  ],
};
const tableData = ref([
  {
    index: '1-1#充电桩',
    acTime: '2020-11-15 24:00',
    useStartV: 55,
    useEndV: 360,
    useNum: 90,
    useCost: 360,
    chargeStartV: 80,
    chargeEndV: 100,
    chargeNum: 20,
    chargeIncome: 30,
  },
  {
    index: '1-2#充电桩',
    acTime: '2020-11-16 24:00',
    useStartV: 57,
    useEndV: 367,
    useNum: 94,
    useCost: 365,
    chargeStartV: 83,
    chargeEndV: 100,
    chargeNum: 28,
    chargeIncome: 39,
  },
  {
    index: '1-3#充电桩',
    acTime: '2020-11-17 24:00',
    useStartV: 58,
    useEndV: 369,
    useNum: 95,
    useCost: 366,
    chargeStartV: 86,
    chargeEndV: 100,
    chargeNum: 33,
    chargeIncome: 45,
  },
  {
    index: '1-4#充电桩',
    acTime: '2020-11-18 24:00',
    useStartV: 47,
    useEndV: 327,
    useNum: 84,
    useCost: 325,
    chargeStartV: 63,
    chargeEndV: 90,
    chargeNum: 16,
    chargeIncome: 27,
  },
  {
    index: '1-5#充电桩',
    acTime: '2020-11-19 24:00',
    useStartV: 57,
    useEndV: 367,
    useNum: 94,
    useCost: 365,
    chargeStartV: 83,
    chargeEndV: 100,
    chargeNum: 28,
    chargeIncome: 39,
  },
  {
    index: '1-6#充电桩',
    acTime: '2020-11-20 24:00',
    useStartV: 58,
    useEndV: 387,
    useNum: 98,
    useCost: 369,
    chargeStartV: 87,
    chargeEndV: 100,
    chargeNum: 27,
    chargeIncome: 37,
  },
  {
    index: '1-7#充电桩',
    acTime: '2020-11-21 24:00',
    useStartV: 58,
    useEndV: 368,
    useNum: 95,
    useCost: 366,
    chargeStartV: 84,
    chargeEndV: 100,
    chargeNum: 29,
    chargeIncome: 40,
  },
  {
    index: '1-8#充电桩',
    acTime: '2020-11-22 24:00',
    useStartV: 56,
    useEndV: 366,
    useNum: 93,
    useCost: 364,
    chargeStartV: 82,
    chargeEndV: 100,
    chargeNum: 27,
    chargeIncome: 38,
  },
  {
    index: '1-9#充电桩',
    acTime: '2020-11-23 24:00',
    useStartV: 57,
    useEndV: 367,
    useNum: 94,
    useCost: 365,
    chargeStartV: 83,
    chargeEndV: 100,
    chargeNum: 28,
    chargeIncome: 39,
  },
  {
    index: '1-10#充电桩',
    acTime: '2020-11-24 24:00',
    useStartV: 60,
    useEndV: 377,
    useNum: 99,
    useCost: 368,
    chargeStartV: 87,
    chargeEndV: 100,
    chargeNum: 33,
    chargeIncome: 44,
  },
]);
</script>

<style lang="scss" scoped>
.operationReport {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;

  :deep(.el-table thead.is-group th.el-table__cell) {
    background-color: transparent !important;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent;
  }

  :deep(.el-table) {
    color: #eaf5ff !important;
    --el-table-border-color: #151c26;
    --el-table-row-hover-bg-color: #05070a;
    --el-table-current-row-bg-color: #05070a;
  }

  :deep(.el-table thead) {
    color: #eaf5ff;
  }

  :deep(.el-table--border .el-table__cell) {
    border: 1px solid #151c26;
  }

  .button-box {
    margin-left: 20px;

    button {
      width: 80px;
      height: 32px;
      background: rgba(0, 163, 255, 0.26) !important;
      border: 1px solid #007bc0;
      border-radius: 4px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
    }
  }

  .time-button {
    border-bottom: 1px solid #1d2634;
    border-top: 1px solid #1d2634;
    padding: 12px 0;
    margin-top: 24px;
    display: flex;
  }

  :deep(.el-button--primary.is-plain) {
    background-color: transparent;
  }

  :deep(.el-table__header) {
    background-color: transparent;
  }

  :deep(.el-table th.el-table__cell.is-leaf) {
    background-color: transparent !important;
  }

  :deep(.el-table tr, .el-table thead) {
    background-color: transparent;
  }

  :deep(.table-inner .el-table) {
    background-color: transparent;
  }

  :deep(.el-table tbody tr:hover > td) {
    background-color: transparent !important; //修改成自己想要的颜色即可
  }

  .content-box {
    padding: 20px 0px 26px 30px;
    display: flex;

    .my-content {
      display: flex;
      background-color: #141c27;
      padding: 12px 0;
      min-width: 249px;
      height: 80px;
      color: #b3b4b6;
      box-sizing: border-box;

      .border-number {
        border-right: 1px solid #434952;
      }

      div {
        padding: 0 9px;
        min-width: 80px;
        text-align: center;
      }

      .big-number {
        font-weight: 700;
        font-size: 22px;
        color: #2ac92b;
        padding-right: 10px;
      }
    }
  }

  .eCharts {
    margin-bottom: 20px;
    height: 300px;
    width: 100%;

    .tit {
      margin-left: 30px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
    }

    .charts {
      width: calc(100% - 60px);
      height: 270px;
      margin: 0px 30px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;
    }
  }

  .table-inner {
    padding: 0px 30px;
  }
}
</style>
