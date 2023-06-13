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
          <div style="height: 50%"><span class="big-number">2560</span><span>kWh</span></div>
          <div style="height: 50%">累计充电</div>
        </div>

        <div class="border-div">
          <div style="height: 50%"><span class="big-number">420</span><span>次</span></div>
          <div style="height: 50%">充电次数</div>
        </div>

        <div>
          <div style="height: 50%"><span class="big-number">110</span><span>h</span></div>
          <div style="height: 50%">充电时长</div>
        </div>
      </div>
    </div>

    <div class="eCharts">
      <div class="tit">充电量分析</div>
      <EdomsCharts class="charts" :option="option"></EdomsCharts>
    </div>

    <div class="table-inner">
      <el-table
        border
        :data="tableData"
        size="mini"
        highlight-current-row
        height="50vh"
        stripe
        fit
        style="width: 100%; height: 100%"
      >
        <el-table-column fixed label="充电桩" prop="name" align="center" width="180" />
        <el-table-column label="采集时间" prop="date" align="center" width="180" />
        <el-table-column label="AC-DC功率(kW)" prop="A_power" align="center" width="180" />
        <el-table-column label="AC-DC输入电压(v)" prop="A_input_voltage" align="center" width="180" />
        <el-table-column label="AC-DC输入电流(A)" prop="A_input_current" align="center" width="180" />
        <el-table-column label="AC-DC输出电压(v)" prop="A_output_voltage" align="center" width="180" />
        <el-table-column label="AC-DC输出电流(A)" prop="A_output_current" align="center" width="180" />
        <el-table-column label="充电量(kWh)" prop="charging_capacity" align="center" width="180" />
        <el-table-column label="充电次数" prop="chargingCycles" align="center" width="180" />
        <el-table-column label="充电时长(h)" prop="duration" align="center" width="180" />
        <el-table-column label="DC-AC功率(kW)" prop="D_power" align="center" width="180" />
        <el-table-column label="DC-AC输入电压(v)" prop="D_input_voltage" align="center" width="180" />
        <el-table-column label="DC-AC输入电流(A)" prop="D_input_current" align="center" width="180" />
        <el-table-column label="DC-AC输出电压(v)" prop="D_output_voltage" align="center" width="180" />
        <el-table-column label="DC-AC输出电流(A)" prop="D_output_current" align="center" width="180" />
        <el-table-column label="反向充电量(kWh)" prop="inCharging_capacity" align="center" width="180" />
        <el-table-column label="反向充电次数" prop="inChargingCycles" align="center" width="180" />
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
      { product: '00:00', straight_value: 43.3 },
      { product: '01:00', straight_value: 63.1 },
      { product: '02:00', straight_value: 76.4 },
      { product: '03:00', straight_value: 65.4 },
      { product: '04:00', straight_value: 62.4 },
      { product: '05:00', straight_value: 72.4 },
      { product: '06:00', straight_value: 62.5 },
      { product: '07:00', straight_value: 62.4 },
      { product: '08:00', straight_value: 52.3 },
      { product: '09:00', straight_value: 63.4 },
      { product: '10:00', straight_value: 52.4 },
      { product: '11:00', straight_value: 52.3 },
      { product: '12:00', straight_value: 49.4 },
      { product: '13:00', straight_value: 42.4 },
      { product: '14:00', straight_value: 72.4 },
      { product: '15:00', straight_value: 42.5 },
      { product: '16:00', straight_value: 52.4 },
      { product: '17:00', straight_value: 42.5 },
      { product: '18:00', straight_value: 52.0 },
      { product: '19:00', straight_value: 62.7 },
      { product: '20:00', straight_value: 62.2 },
      { product: '21:00', straight_value: 62.6 },
      { product: '22:00', straight_value: 77.7 },
      { product: '23:00', straight_value: 79.7 },
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
    name: 'kWh',
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
      name: '正向充电',
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
    name: '1-1#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-2#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-3#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-4#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-5#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-6#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-7#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-8#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-9#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
  {
    name: '1-10#充电桩',
    date: '2020-11-15 24:00',
    A_power: 55,
    A_input_voltage: 360,
    A_input_current: 90,
    A_output_voltage: 360,
    A_output_current: 80,
    charging_capacity: 345,
    chargingCycles: 3,
    duration: 2.5,
    D_power: 60,
    D_input_voltage: 60,
    D_input_current: 380,
    D_output_voltage: 80,
    D_output_current: 380,
    inCharging_capacity: 120,
    inChargingCycles: 110,
  },
]);
</script>

<style lang="scss" scoped>
.runReport {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;

  :deep(.el-table thead.is-group th.el-table__cell) {
    background-color: transparent !important;
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

  :deep(.el-table__body-wrapper tr td.el-table-fixed-column--left) {
    background-color: #05070a;
  }

  :deep(.el-table.is-scrolling-middle .el-table-fixed-column--left.is-last-column.el-table__cell) {
    border-right: 1px solid #151c26;
  }

  :deep(.el-scrollbar__view) {
    height: 100%;
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
    background-color: #090d12 !important;
  }

  :deep(.el-table.is-scrolling-left.el-table--border .el-table-fixed-column--left.is-last-column.el-table__cell) {
    background-color: #05070a;
  }

  :deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
    background-color: #090d12 !important;
  }

  :deep(.el-table tr, .el-table thead) {
    background-color: transparent;
  }

  :deep(.table-inner .el-table) {
    background-color: transparent;
  }

  :deep(.el-table__body) {
    height: 100%;
  }

  .content-box {
    padding: 20px 0px 26px 30px;
    display: flex;

    .border-div {
      border-left: 1px solid #434952;
      border-right: 1px solid #434952;
    }

    .my-content {
      display: flex;
      background-color: #141c27;
      padding: 12px 0;
      width: 374px;
      height: 80px;
      color: #b3b4b6;
      box-sizing: border-box;

      div {
        padding: 0 12px;
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
