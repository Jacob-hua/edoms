<template>
  <div class="system-tab">
    <div class="left-calculate">
      <div class="title-ft">
        <span class="title-icon"></span>
        <span class="font-value">计算书</span>
      </div>
      <div class="calculate-img"></div>
      <div class="calculate-constr">
        <div v-for="(itm, idx) in construction" :key="idx" class="contructor-item">
          <span class="constr-key">{{ itm.key }}:</span>
          <span class="constr-value">{{ itm.value }}</span>
        </div>
      </div>
    </div>
    <div class="right-chart-st">
      <div class="title-ft">
        <span class="title-icon"></span>
        <span class="font-value">制热功率曲线</span>
      </div>
      <SelectOptions class="select-options-parent" :init-val="'日'" @on-select-change="handlerToChange" />
      <div class="chart-wrapper">
        <ChartData :options="options" :width="980" :height="360" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// withDefaults
import { onBeforeMount, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';

import ChartData from './chartData.vue';
import SelectOptions from './selectOptions.vue';

// const props = withDefaults(
//   defineProps<{
//     list: Array<{ [key: string]: any }>;
//   }>(),
//   {
//     list: () => [],
//   }
// );

const xData: Array<string> = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
];

const yData: Array<number> = [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40];

const options = ref<any>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
        color: '#FFFFFF',
        width: 1,
        shadowColor: '#FFFFFF',
        opacity: 0.2,
      },
    },
    backgroundColor: '#0b2234',
    borderColor: '#204C6F',
    formatter: (params: any) => {
      return `
        <div>
            <span style="color: #ffffff; font-size: 12px">时间: </span>
            <span style="color: #41e4de; font-size: 12px">${params[0].axisValue}</span>
        </div>
        <div>
            <span style="color: #ffffff; font-size: 12px">${params[0].seriesName}:</span>
            <span style="color: #41e4de; font-size: 12px">${params[0].value}</span>
        </div>
      `;
    },
  },
  grid: {
    top: '0%',
    left: '7%',
    right: '5%',
    bottom: '5%',
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#a4daff',
          opacity: 0.2,
        },
      },
      axisLabel: {
        show: true,
        color: '#d9d9d9',
      },
      splitLine: {
        show: false,
      },
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      data: xData,
    },
  ],

  yAxis: [
    {
      type: 'value',
      // max: 60,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        type: 'solid',
        width: 1,
        lineStyle: {
          color: '#a4daff',
          type: 'dashed',
          opacity: 0.2,
        },
      },
      axisLabel: {
        show: false,
        textStyle: {
          color: '#f00',
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '功率值',
      type: 'line',
      showAllSymbol: false,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 0,
      data: yData,
      smooth: true,
      itemStyle: {
        borderWidth: 1,
        color: '#41e4de',
        borderColor: '#fff',
        normal: {
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#41e4de',
              },
              {
                offset: 0.5,
                color: '#41e4de',
              },
              {
                offset: 1,
                color: '#41e4de',
              },
            ]),
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(65,228,222, 0.2)',
              },
              {
                offset: 0.4,
                color: 'rgba(65,228,222, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(65,228,222, 0)',
              },
            ]),
          },
        },
      },
      markLine: {
        symbol: 'none',
        data: [
          {
            name: '有效均值',
            // type:'average',
            yAxis: 50,
            lineStyle: {
              normal: {
                color: '#4193F7',
                width: 1.2,
              },
            },
            label: {
              show: true,
              position: 'middle',
              color: '#F5F7FA',
              fontSize: 14,
              formatter: ['{text|有效均值：}', `{num|${50}}`].join(''),
              rich: {
                text: {
                  color: '#F5F7FA',
                  fontSize: 14,
                },
                num: {
                  color: 'rgba(65, 228, 222, 1)',
                  fontSize: 14,
                },
              },
              // formatter: (param: any) => {
              //   return `${'有效均值：' + param.value}`;
              // },
            },
          },
        ],
      },
    },
  ],
});

const handlerToChange = (itm: string) => {
  if (itm === '日') {
    options.value.xAxis[0].data = [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
    ];
    options.value.series[0].data = [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40];
  } else if (itm === '月') {
    options.value.xAxis[0].data = [
      '2023-5-1',
      '2023-5-2',
      '2023-5-3',
      '2023-5-4',
      '2023-5-5',
      '2023-5-6',
      '2023-5-7',
      '2023-5-8',
      '2023-5-9',
      '2023-5-10',
      '2023-5-11',
      '2023-5-12',
      '2023-5-13',
      '2023-5-14',
      '2023-5-15',
      '2023-5-16',
    ];
    options.value.series[0].data = [15, 20, 30, 41, 10, 20, 30, 100, 30, 20, 30, 40, 10, 20, 30, 40];
  } else {
    options.value.xAxis[0].data = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
    options.value.series[0].data = [29, 10, 30, 40, 15, 20, 80, 40, 10, 20, 20, 40];
  }
};

const construction = ref<Array<{ [key: string]: string }>>([
  { key: 'P', value: '制热功率,单位kW' },
  { key: 'Cp', value: '循环水的定压比热容,单位kJ/（kg℃）' },
  { key: 'P', value: '测量点处温度和压力条件下的循环水的密度,单位kg/m³' },
  { key: 'V', value: '循环水流量,单位m³ /h' },
  { key: 't1', value: '出水温度,单位 ℃' },
  { key: 't2', value: '出水温度,单位 ℃' },
]);

onBeforeMount(() => {});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.system-tab {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .left-calculate {
    width: 413px;
    height: 500px;
    border: 1px solid rgba(33, 44, 60, 1);
    box-sizing: border-box;
    background-color: rgba(9, 15, 23, 0.3);
    .title-ft {
      line-height: 50px;
      height: 50px;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      display: flex;
      padding: 0 20px;
      box-sizing: border-box;
      .title-icon {
        display: block;
        width: 18px;
        height: 18px;
        background-image: url('../assets/model-icon.png');
        background-size: 18px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        margin-top: 16px;
      }
      .font-value {
        color: rgba(234, 245, 255, 1);
        font-size: 16px;
        margin-left: 15px;
      }
    }
    .calculate-img {
      width: calc(100% - 20px);
      height: 180px;
      margin: 0 auto;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      background-image: url('../assets/calculation.png');
      background-size: 278px 94px;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .calculate-constr {
      width: 100%;
      height: calc(100% - 181px - 51px);
      padding: 15px 20px;
      box-sizing: border-box;
      .contructor-item {
        width: 100%;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        margin-bottom: 25px;
        .constr-key {
          margin-right: 10px;
        }
      }
    }
  }
  .right-chart-st {
    width: 980px;
    height: 500px;
    border: 1px solid rgba(33, 44, 60, 1);
    box-sizing: border-box;
    background-color: rgba(9, 15, 23, 0.3);
    .title-ft {
      line-height: 50px;
      height: 50px;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      display: flex;
      padding: 0 20px;
      box-sizing: border-box;
      .title-icon {
        display: block;
        width: 18px;
        height: 18px;
        background-image: url('../assets/model-icon.png');
        background-size: 18px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        margin-top: 16px;
      }
      .font-value {
        color: rgba(234, 245, 255, 1);
        font-size: 16px;
        margin-left: 15px;
      }
    }
    .select-options-parent {
      float: right;
      // margin-right: 30px;
      margin: 14px 30px;
    }
    .chart-wrapper {
      width: 980px;
      height: 360px;
      margin-top: 60px;
    }
  }
}
</style>
