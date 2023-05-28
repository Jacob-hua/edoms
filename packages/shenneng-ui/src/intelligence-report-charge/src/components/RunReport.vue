<template>
  <div class="runReport">
    <div class="time-button">
      <TimeCalendar :option="timeType"></TimeCalendar>

      <div class="button-box">
        <el-button size="small" type="primary" plain>查询</el-button>
        <el-button size="small" type="primary" plain>导出</el-button>
      </div>
    </div>

    <div class="content-box">
      <div class="my-content">
        <div>
          <div><span class="big-number">2560</span><span>kWh</span></div>
          <div>累计充电</div>
        </div>

        <div class="border-div">
          <div><span class="big-number">420</span><span>次</span></div>
          <div>充电次数</div>
        </div>

        <div>
          <div><span class="big-number">110</span><span>h</span></div>
          <div>充电时长</div>
        </div>
      </div>
      <div class="my-content">
        <div>
          <div><span class="big-number">210</span><span>kWh</span></div>
          <div>反向充电</div>
        </div>

        <div class="border-div">
          <div><span class="big-number">11</span><span>次</span></div>
          <div>反向充电次数</div>
        </div>

        <div>
          <div><span class="big-number">3</span><span>h</span></div>
          <div>反向充电时长</div>
        </div>
      </div>
    </div>

    <div class="eCharts">
      <!-- <div>充电量分析</div> -->
      <EdomsCharts class="charts" :option="option"></EdomsCharts>
    </div>

    <div class="table-inner">
      <el-table border :data="tableData" size="mini" highlight-current-row height="50vh" fit style="width: 100%">
        <el-table-column label="充电桩" prop="index" align="center" />
        <el-table-column label="采集时间" prop="modelName" align="center" />
        <el-table-column label="AC-DC功率(kW)" prop="gatewayName" align="center" />
        <el-table-column label="AC-DC输入电压(v)" prop="gatewayCode" align="center" />
        <el-table-column label="AC-DC输入电流(A)" prop="gatewayLx" align="center" />
        <el-table-column label="AC-DC输出电压(v)" prop="gatewayType" align="center" />
        <el-table-column label="AC-DC输出电流(A)" prop="gatewayAddress" align="center" />
        <el-table-column label="充电量(kWh)" prop="sysInsName" align="center" />
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
    text: '充电量分析',
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
      { product: '00:00', 正向充电: 43.3, 反向充电: 85.8 },
      { product: '01:00', 正向充电: 63.1, 反向充电: 84.4 },
      { product: '02:00', 正向充电: 76.4, 反向充电: 88.2 },
      { product: '03:00', 正向充电: 65.4, 反向充电: 76.5 },
      { product: '04:00', 正向充电: 62.4, 反向充电: 87.7 },
      { product: '05:00', 正向充电: 72.4, 反向充电: 93.5 },
      { product: '06:00', 正向充电: 62.5, 反向充电: 95.6 },
      { product: '07:00', 正向充电: 62.4, 反向充电: 85.8 },
      { product: '08:00', 正向充电: 52.3, 反向充电: 79.7 },
      { product: '09:00', 正向充电: 63.4, 反向充电: 93.8 },
      { product: '10:00', 正向充电: 52.4, 反向充电: 75.4 },
      { product: '11:00', 正向充电: 52.3, 反向充电: 78.6 },
      { product: '12:00', 正向充电: 49.4, 反向充电: 79.5 },
      { product: '13:00', 正向充电: 42.4, 反向充电: 84.8 },
      { product: '14:00', 正向充电: 72.4, 反向充电: 91.8 },
      { product: '15:00', 正向充电: 42.5, 反向充电: 66.4 },
      { product: '16:00', 正向充电: 52.4, 反向充电: 75.9 },
      { product: '17:00', 正向充电: 42.5, 反向充电: 68.4 },
      { product: '18:00', 正向充电: 52.0, 反向充电: 73.7 },
      { product: '19:00', 正向充电: 62.7, 反向充电: 75.9 },
      { product: '20:00', 正向充电: 62.2, 反向充电: 91.8 },
      { product: '21:00', 正向充电: 62.6, 反向充电: 79.7 },
      { product: '22:00', 正向充电: 77.7, 反向充电: 88.8 },
      { product: '23:00', 正向充电: 79.7, 反向充电: 83.5 },
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
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-2#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-3#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-4#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-5#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-6#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-7#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-8#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-9#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
  {
    index: '1-10#充电桩',
    modelName: '2020-11-15 24:00',
    gatewayName: 55,
    gatewayCode: 360,
    gatewayLx: 90,
    gatewayType: 360,
    gatewayAddress: 80,
    sysInsName: 345,
  },
]);
</script>

<style lang="scss" scoped>
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: transparent;
}
.runReport {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  :deep(.el-table thead.is-group th.el-table__cell) {
    background-color: transparent !important;
  }
  :deep(.el-table__body tr:hover > td.el-table__cell) {
    background-color: transparent;
  }
  .el-table__body tr:hover {
    background-color: transparent !important;
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
  .content-box {
    padding: 16px 12px;
    display: flex;
    .border-div {
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
    .my-content {
      display: flex;
      background-color: #141c27;
      padding: 12px 0;
      color: #fff;
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
