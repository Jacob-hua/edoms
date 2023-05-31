<template>
  <div class="operations-analysis-pv" @click="handlerToShow($event, true)">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/outer-bg.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">运行分析</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-data">
          <div class="frist-tab">
            <el-tabs v-model="activeNameF" class="tab demo-tabs" type="card" @tab-click="handleClickF">
              <el-tab-pane label="发电量分析" name="power-qua"></el-tab-pane>
              <el-tab-pane label="发电功率分析" name="power-gen"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="second-tab">
            <el-tabs v-model="activeNameS" class="demo-tabs" @tab-click="handleClickS">
              <el-tab-pane label="日曲线" name="day"> </el-tab-pane>
              <el-tab-pane label="月曲线" name="month"> </el-tab-pane>
              <el-tab-pane v-if="activeNameF === 'power-qua'" label="年曲线" name="year"> </el-tab-pane>
            </el-tabs>
          </div>
          <div class="select-gro">
            <div v-show="activeNameF === 'power-qua' ? true : false" class="dataTotal">
              <p v-show="activeNameS === 'month' ? true : false">当月发电量：<span>5205.3kWh</span></p>
              <p v-if="activeNameS === 'month' || activeNameS === 'year'">累计发电量：<span>61767.82kWh</span></p>
              <p v-if="activeNameS === 'month' || activeNameS === 'year'">装机容量：<span>195kW</span></p>
            </div>
            <div class="other" style="display: flex">
              <el-select
                v-model="value"
                :teleported="false"
                popper-class="select-sty"
                style="margin-right: 20px"
                class="m-2"
                placeholder="Select"
              >
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <div class="selest-time">
                <span>日期选择：</span>
                <TimeCalendar ref="timeWrapper" :option="timeType" @ct-time="changeTime"></TimeCalendar>
              </div>
            </div>
          </div>
          <div class="chart-pv">
            <EdomsCharts class="charts" :option="option"></EdomsCharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';

import TimeCalendar from './components/TimeCalendar.vue';
import { OperationsAnalysisPv } from './type';

defineProps<{
  config: OperationsAnalysisPv;
}>();
const option = ref<ECOption>({});
const isShowModel = ref<boolean>(false);
const timeWrapper = ref<any>(null);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
const timeType = ref('date');
const activeNameF = ref('power-qua');
const activeNameS = ref('day');
const value = ref('all');
const defaultTime = ref<Record<string, any>>(new Date('2023-05-15 00:00:00'));
// 天功率数据
const seriesPowerData = {
  fifteen: [0, 0, 0, 0, 0, 0, 5.6, 19.3, 27.2, 25.2, 19.2, 14.4, 9.4, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sixteen: [0, 0, 0, 0, 0, 0, 4.9, 18.1, 26, 28.4, 20.4, 14, 8.1, 1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  seventeen: [0, 0, 0, 0, 0, 0, 5.6, 24.6, 15.3, 24.7, 28.6, 12.3, 0.9, 10.1, 2.9, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  eighteen: [0, 0, 0, 0, 0, 0, 5.9, 17.9, 27.5, 27.6, 18.6, 15.9, 7.8, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  nineteen: [0, 0, 0, 0, 0, 0, 6.8, 19.4, 24.6, 25.1, 19.2, 14.3, 6.8, 1.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  twenty: [0, 0, 0, 0, 0, 0, 5.4, 17.2, 20.2, 29.4, 19.3, 19.8, 8.9, 9.3, 0, 0, 0, 0, 0],
};
// 月功率数据
const seriesPowerMonthData = {
  five: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 948.5, 796.8, 743.7, 950.2, 871.4, 894.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
};
// 天电量数据
const seriesDayData = {
  fifteen: [
    0, 0, 0, 0, 0, 1.5, 14.3, 38.4, 65.2, 87.4, 103.7, 115.7, 119.4, 115.4, 104.5, 83.2, 59, 30.7, 9.5, 0.6, 0, 0, 0,
  ],
  sixteen: [
    0, 0, 0, 0, 0, 1.6, 13.3, 35.9, 63.1, 87.6, 104.8, 115.6, 119.7, 115.8, 94.1, 20.1, 16.9, 6.5, 1.7, 0.1, 0, 0, 0,
  ],
  seventeen: [
    0, 0, 0, 0, 0, 0, 1.4, 14.9, 30.2, 42.3, 74.1, 100.5, 83.3, 80.3, 93.3, 80.1, 58, 52.2, 25.7, 6.9, 0.5, 0, 0, 0,
  ],
  eighteen: [
    0, 0, 0, 0, 0, 0, 1.7, 13.9, 37.1, 64.9, 88.5, 104.8, 115.2, 119.2, 115.6, 102, 83.4, 55.7, 34.5, 12.8, 0.9, 0, 0,
    0,
  ],
  nineteen: [
    0, 0, 0, 0, 0, 0, 2, 15.8, 38.5, 63.3, 85.3, 102, 112.8, 114.9, 109.9, 96.8, 59.6, 40.5, 21.6, 7.9, 0.5, 0, 0, 0,
  ],
  twenty: [0, 0, 0, 0, 0, 0, 1.5, 13, 30.2, 55.5, 67.5, 96, 113.2, 115.8, 115, 104.5, 85.1, 61.8, 35.6],
};
let seriesData1 = seriesDayData.fifteen;
let seriesData2 = seriesPowerData.fifteen;

// 月电量数据
const seriesMonthData = {
  five: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 948.5, 796.8, 743.7, 950.2, 871.4, 894.7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
};
// 年电量数据
const seriesYearData = {
  five: [0, 0, 0, 0, 5205.3, 0, 0, 0, 0, 0, 0, 0],
};
const changeTime = (time: Record<string, any>) => {
  switch (time.getDate()) {
    case 16:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.sixteen;
      } else {
        seriesData1 = seriesDayData.sixteen;
      }
      getData('day');
      break;
    case 17:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.seventeen;
      } else {
        seriesData1 = seriesDayData.seventeen;
      }
      getData('day');
      break;
    case 18:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.eighteen;
      } else {
        seriesData1 = seriesDayData.eighteen;
      }
      getData('day');
      break;
    case 19:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.nineteen;
      } else {
        seriesData1 = seriesDayData.nineteen;
      }
      getData('day');
      break;
    case 20:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.twenty;
      } else {
        seriesData1 = seriesDayData.twenty;
      }
      getData('day');
      break;
    default:
      if (activeNameF.value === 'power-gen') {
        seriesData2 = seriesPowerData.fifteen;
      } else {
        seriesData1 = seriesDayData.fifteen;
      }
      getData('day');
      break;
  }
};

const options = [
  {
    value: 'all',
    label: '总览',
  },
];
// 切换发电量/功率
const handleClickF = (event: any) => {
  if (activeNameF.value === event.paneName) {
    return;
  }
  activeNameF.value = event.paneName;
  activeNameS.value = 'day';
  // 默认展示日
  changeTime(defaultTime.value);
  timeWrapper.value.setDefultTime();
  // getData(activeNameS.value);
};
// 切换日/月/年曲线
const handleClickS = (event: any) => {
  if (activeNameS.value === event.paneName) {
    return;
  }
  activeNameS.value = event.paneName;
  if (event.paneName === 'day') {
    changeTime(defaultTime.value);
    timeWrapper.value.setDefultTime(defaultTime.value);
  } else if (event.paneName === 'month') {
    timeWrapper.value.setDefultTime(new Date('2023-05'));
    getData(activeNameS.value);
  } else {
    getData(activeNameS.value);
  }
};

// 获取charts数据
const getData = (symbol: string) => {
  if (activeNameF.value === 'power-gen') {
    if (symbol === 'day') {
      timeType.value = 'date';
      option.value = {
        grid: {
          top: 40,
          left: 40,
          right: 30,
        },
        xAxis: {
          type: 'category',
          name: '时',
          data: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
          ],
          axisTick: {
            show: false,
          },
        },
        color: ['#00FFF0', '#287CE8'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(11,34,52,0.9)',
          borderColor: '#204C6F',
          borderWidth: 1,
          formatter: (params: any) => {
            let tip: string = '';
            if (params != null && params.length > 0) {
              tip += '<div><p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' + params[0].name + '：00</p>';
              for (let index = 0; index < params.length; index++) {
                tip +=
                  '<p>' +
                  params[index].marker +
                  '<span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：' +
                  params[index].value +
                  // params[index].seriesName != '总览' ? '' : 'kWh' +
                  '' +
                  (params[index].seriesName != '总览' ? '' : 'kWh') +
                  '</span></p>';
              }
              tip += '</div>';
            }
            return tip;
          },
        },
        legend: {
          bottom: '0%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            // lineHeight: 28,
            // padding: [0, 0, 0, 100],
            fontSize: '12',
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#9F9FA0',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: '#9F9FA0',
          },
        },
        series: [
          {
            name: '总览',
            data: seriesData2,
            type: 'line',
            smooth: true,
            symbolSize: 0,
          },
          {
            name: '装机量',
            data: [
              195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195,
              195, 195, 195,
            ],
            type: 'line',
            smooth: true,
            symbolSize: 0,
          },
        ],
      };
    } else {
      timeType.value = 'month';
      option.value = {
        grid: {
          top: 40,
          left: 40,
          right: 30,
        },
        xAxis: {
          type: 'category',
          name: '日',
          data: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
          ],
          axisTick: {
            show: false,
          },
        },
        color: ['rgba(40,124,232,0.5)', '#176CF4'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(11,34,52,0.9)',
          borderColor: '#204C6F',
          borderWidth: 1,
          formatter: (params: any) => {
            let tip: string = '';
            if (params != null && params.length > 0) {
              tip +=
                '<div><p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">2023-5-' + params[0].name + '</p>';
              for (let index = 0; index < params.length; index++) {
                tip +=
                  '<p>' +
                  params[index].marker +
                  '<span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：' +
                  params[index].value +
                  '' +
                  (params[index].seriesName != '总览' ? '' : 'kWh') +
                  '</span></p>';
              }
              tip += '</div>';
            }
            return tip;
          },
        },
        legend: {
          bottom: '0%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            // lineHeight: 28,
            // padding: [0, 0, 0, 100],
            fontSize: '12',
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#9F9FA0',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: '#9F9FA0',
          },
        },
        series: [
          {
            name: '总览',
            data: seriesPowerMonthData.five,
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#287CE8',
            },
            barWidth: 16,
            barGap: 70,
          },
          {
            name: '装机量',
            data: [
              195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195, 195,
              195, 195, 195, 195, 195, 195, 195, 195, 195, 195,
            ],
            type: 'line',
            smooth: true,
            symbolSize: 0,
          },
        ],
      };
    }
  } else {
    if (symbol === 'day') {
      timeType.value = 'date';
      option.value = {
        grid: {
          top: 40,
          left: 40,
          right: 30,
        },
        xAxis: {
          type: 'category',
          name: '时',
          data: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
          ],
          axisTick: {
            show: false,
          },
        },
        color: 'rgba(40,124,232,0.5)',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(11,34,52,0.9)',
          borderColor: '#204C6F',
          borderWidth: 1,
          formatter: (params: any) => {
            console.log(params);
            let tip: string = '';
            if (params != null && params.length > 0) {
              tip += '<div>';
              for (let index = 0; index < params.length; index++) {
                tip +=
                  '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].name +
                  '：00</p><p>' +
                  params[index].marker +
                  '<span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：' +
                  params[index].value +
                  'kWh</span></p>';
              }
              tip += '</div>';
            }
            return tip;
          },
        },
        legend: {
          bottom: '0%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            // lineHeight: 28,
            // padding: [0, 0, 0, 100],
            fontSize: '12',
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#9F9FA0',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: '#9F9FA0',
          },
        },
        series: [
          {
            name: '发电量',
            data: seriesData1,
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#287CE8',
            },
            barWidth: 16,
            barGap: 70,
          },
        ],
      };
    } else if (symbol === 'month') {
      timeType.value = 'month';
      option.value = {
        grid: {
          top: 40,
          left: 40,
          right: 30,
        },
        xAxis: {
          type: 'category',
          name: '日',
          data: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
          ],
          axisTick: {
            show: false,
          },
        },
        color: 'rgba(40,124,232,0.5)',
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
                  '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">2023-5-' +
                  params[index].name +
                  '</p><p>' +
                  params[index].marker +
                  '<span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：' +
                  params[index].value +
                  'kWh</span></p>';
              }
              tip += '</div>';
            }
            return tip;
          },
        },
        legend: {
          bottom: '0%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            // lineHeight: 28,
            // padding: [0, 0, 0, 100],
            fontSize: '12',
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#9F9FA0',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: '#9F9FA0',
          },
        },
        series: [
          {
            name: '发电量',
            data: seriesMonthData.five,
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#287CE8',
            },
            barWidth: 16,
            barGap: 70,
          },
        ],
      };
    } else {
      timeType.value = 'year';
      option.value = {
        grid: {
          top: 40,
          left: 40,
          right: 30,
        },
        xAxis: {
          type: 'category',
          name: '月',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          axisTick: {
            show: false,
          },
        },
        color: 'rgba(40,124,232,0.5)',
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
                  '<p style="color: #F5F7FA;font-size: 12px;font-weight: 400;">2023-' +
                  params[index].name +
                  '</p><p>' +
                  params[index].marker +
                  '<span style="color: #F5F7FA;font-size: 12px;font-weight: 400;">' +
                  params[index].seriesName +
                  '：' +
                  params[index].value +
                  'kWh</span></p>';
              }
              tip += '</div>';
            }
            return tip;
          },
        },
        legend: {
          bottom: '0%',
          left: 'center',
          itemWidth: 15,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
          },
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            // lineHeight: 28,
            // padding: [0, 0, 0, 100],
            fontSize: '12',
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400,
            color: '#9F9FA0',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#1A242B',
              width: 1,
            },
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: '#9F9FA0',
          },
        },
        series: [
          {
            name: '发电量',
            data: seriesYearData.five,
            type: 'bar',
            itemStyle: {
              borderWidth: 1,
              borderColor: '#287CE8',
            },
            barWidth: 16,
            barGap: 70,
          },
        ],
      };
    }
  }
};
getData('day');
</script>

<style lang="scss" scoped>
:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item) {
  padding: 0 !important;
  width: 124px;
  height: 32px;
  color: #eaf5ff;
  text-align: center;
  line-height: 32px;
  background: #00111a;
  border: none;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: none;
  border-left: none;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  background: #00283f;
  border: 1px solid #007bc0;
  color: #ffffff;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: none;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header) {
  margin: 0;
  border: none;
}

:deep(.second-tab > .el-tabs--card > .el-tabs__header .el-tabs__nav) {
  line-height: 80px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #4d505f;
}

:deep(.second-tab > .el-tabs--card > .el-tabs__header) {
  margin: 0px;
}

// :deep(.second-tab > .el-tabs__nav-wrap::after) {
//   content: none;
// }

:deep(.el-tabs__active-bar) {
  background: #00a3ff;
}

:deep(.el-tabs__item) {
  color: #eaf5ff;
}

:deep(.el-select) {
  width: 218px;
  height: 36px;
  margin-right: 20px;
}

:deep(.el-input__wrapper) {
  background: #010101;
  border: 1px solid #454e72;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-input__inner) {
  color: #ffffff;
}

:deep(.el-popper) {
  border-radius: 0;
}

:deep(.el-popper.is-pure) {
  inset: auto !important;
}

:deep(.el-select-dropdown__list) {
  margin: auto !important;
}

:deep(.el-popper__arrow::before) {
  content: none;
}

.operations-analysis-pv {
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

  .model-wrapper-ftst {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .model-content {
      width: 1400px;
      height: 95%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);

      .content-title {
        width: 100%;
        height: 52px;
        line-height: 52px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background-image: url('../src/assets/title-bg.png');
        background-size: 100% 100%;
        border-bottom: 1px solid #013460;

        .left-title-font {
          display: flex;

          .font-icon {
            display: block;
            width: 24px;
            height: 24px;
            background-image: url('../src/assets/model-icon.png');
            background-size: 24px 24px;
            background-position: center center;
            background-repeat: no-repeat;
            margin-top: 14px;
          }

          .font-value {
            color: rgba(234, 245, 255, 1);
            font-size: 18px;
            margin-left: 15px;
          }
        }

        .right-close {
          width: 24px;
          height: 24px;
          // title-bg
          background-image: url('../src/assets/title-close.png');
          background-size: 14px 14px;
          background-position: center center;
          background-repeat: no-repeat;
          margin-top: 14px;
          cursor: pointer;
        }
      }

      .content-data {
        width: 100%;
        height: calc(100% - 52px);
        padding: 30px;
        box-sizing: border-box;

        .frist-tab {
          width: 100%;
          height: 34px;
        }

        .select-gro {
          display: flex;
          width: 100%;
          height: 36px;
          line-height: 36px;

          .dataTotal {
            display: flex;

            p {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #8d9cbd;
              margin-right: 40px;

              span {
                color: #ffffff;
              }
            }
          }

          .other {
            display: flex;
            position: absolute;
            right: 30px;

            .select-sty {
              inset: auto !important;
              background-color: #030507;

              .el-select-dropdown__item {
                border-bottom: 1px solid #454e72;
                background-color: #030507;
                padding: 0 !important;
                text-align: center;
              }
            }

            .selest-time {
              display: flex;

              span {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #7b8aaa;
              }
            }
          }
        }

        .chart-pv {
          height: 85%;

          .charts {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
