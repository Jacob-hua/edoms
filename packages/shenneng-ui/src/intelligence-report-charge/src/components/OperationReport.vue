<template>
  <div class="operationReport">
    <div class="time-button">
      <TimeCalendar :option="timeType"></TimeCalendar>

      <div class="button-box">
        <el-button size="small" type="primary" plain>查询</el-button>
        <el-button size="small" type="primary" plain>导出</el-button>
      </div>
    </div>

    <div class="content-box">
      <div class="my-content">
        <div class="border-number">
          <div><span class="big-number">420</span><span>kWh</span></div>
          <div>累计用电</div>
        </div>

        <div>
          <div><span class="big-number">12543</span><span>元</span></div>
          <div>累计用电成本</div>
        </div>
      </div>
      <div class="my-content">
        <div class="border-number">
          <div><span class="big-number">110</span><span>kWh</span></div>
          <div>乐基反向充电</div>
        </div>

        <div>
          <div><span class="big-number">2543</span><span>元</span></div>
          <div>反向充电收益</div>
        </div>
      </div>
    </div>

    <div class="eCharts">
      <!-- <div>充电量分析</div> -->
      <EdomsCharts class="charts" :option="option"></EdomsCharts>
    </div>

    <div class="table-inner">
      <el-table :data="tableData" size="mini" highlight-current-row height="50vh" fit style="width: 100%">
        <el-table-column label="充电桩" prop="index" align="center" />
        <el-table-column width="180" label="采集时间" prop="acTime" align="center" />
        <el-table-column label="用电量" align="center">
          <el-table-column label="起始值(kWh)" prop="useStartV" align="center" />
          <el-table-column label="结束值(kWh)" prop="useEndV" align="center" />
          <el-table-column label="用电量(kWh)" prop="useNum" align="center" />
          <el-table-column label="用电成本(元)" prop="useCost" align="center" />
        </el-table-column>
        <el-table-column label="反向充电量" align="center">
          <el-table-column label="起始值(kWh)" prop="chargeStartV" align="center" />
          <el-table-column label="结束值(kWh)" prop="chargeEndV" align="center" />
          <el-table-column width="160" label="反向充电量(kWh)" prop="chargeNum" align="center" />
          <el-table-column label="收益(元)" prop="chargeIncome" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';

import TimeCalendar from './TimeCalendar.vue';
const timeType = ref<string>('date');
const option = ref<ECOption>({});
option.value = {
  backgroundColor: '#030507',
  title: {
    text: '电量分析',
    textStyle: {
      color: '#fff',
    },
  },
  legend: {
    bottom: 10,
    textStyle: {
      color: '#fff',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  dataset: {
    dimensions: ['product', '正向充电', '反向充电'],
    source: [
      { product: '00:00', 正向充电: 22, 反向充电: 0 },
      { product: '01:00', 正向充电: 0, 反向充电: -30 },
      { product: '02:00', 正向充电: 24, 反向充电: 0 },
      { product: '03:00', 正向充电: 0, 反向充电: -33 },
      { product: '04:00', 正向充电: 0, 反向充电: -31 },
      { product: '05:00', 正向充电: 24, 反向充电: 0 },
      { product: '06:00', 正向充电: 21, 反向充电: 0 },
      { product: '07:00', 正向充电: 22, 反向充电: 0 },
      { product: '08:00', 正向充电: 0, 反向充电: -30 },
      { product: '09:00', 正向充电: 0, 反向充电: -31 },
      { product: '10:00', 正向充电: 22.4, 反向充电: 0 },
      { product: '11:00', 正向充电: 22.3, 反向充电: 0 },
      { product: '12:00', 正向充电: 31.4, 反向充电: 0 },
      { product: '13:00', 正向充电: 22.4, 反向充电: 0 },
      { product: '14:00', 正向充电: 23.4, 反向充电: 0 },
      { product: '15:00', 正向充电: 25.5, 反向充电: 0 },
      { product: '16:00', 正向充电: 21.4, 反向充电: 0 },
      { product: '17:00', 正向充电: 27.5, 反向充电: 0 },
      { product: '18:00', 正向充电: 20.0, 反向充电: 0 },
      { product: '19:00', 正向充电: 22.7, 反向充电: 0 },
      { product: '20:00', 正向充电: 24.2, 反向充电: 0 },
      { product: '21:00', 正向充电: 20.6, 反向充电: 0 },
      { product: '22:00', 正向充电: 0, 反向充电: 28.8 },
      { product: '23:00', 正向充电: 0, 反向充电: 23.5 },
    ],
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      barGap: 0, //柱间距离
      itemStyle: {
        // @ts-ignore
        normal: {
          show: true,
          color: '#154F8B',
          barBorderRadius: 0,
          borderWidth: 0,
        },
      },
      label: {
        // @ts-ignore
        normal: {
          show: false,
          position: 'top',
        },
      },
    },
    {
      type: 'bar',
      barWidth: 14,
      barGap: 0, //柱间距离
      itemStyle: {
        // @ts-ignore
        normal: {
          show: true,
          color: '#236A12',
          barBorderRadius: 0,
          borderWidth: 0,
        },
      },
      label: {
        // @ts-ignore
        normal: {
          show: false,
          position: 'top',
        },
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
  .button-box {
    margin-left: 20px;
  }
  .time-button {
    border-bottom: 1px solid #454e72;
    padding: 16px 12px;
    display: flex;
  }
  :deep(.el-button--primary.is-plain) {
    background-color: transparent;
  }
  :deep(.el-table__header) {
    background-color: transparent;
  }
  :deep(.el-table th.el-table__cell.is-leaf) {
    border-left-color: rgb(144, 147, 153) !important;
    border-right-color: rgb(144, 147, 153) !important;
    background: transparent;
  }
  :deep(.el-table th.el-table__cell.is-leaf) {
    background-color: transparent !important;
  }
  //rgb(144, 147, 153)
  :deep(.el-table td.el-table__cell) {
    border-color: rgb(144, 147, 153) !important;
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
    padding: 16px 12px;
    display: flex;
    .my-content {
      display: flex;
      background-color: #141c27;
      padding: 12px 0;
      color: #fff;
      .border-number {
        border-right: 1px solid #eee;
      }
      &:first-child {
        margin-right: 30px;
      }
      div {
        padding: 0 12px;
        min-width: 80px;
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
    .charts {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
