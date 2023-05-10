<template>
  <div class="cold-tab">
    <div class="left-calculate">
      <div class="title-ft">
        <span class="title-icon"></span>
        <span class="font-value-cold">温度监测</span>
        <SelectOptions class="select-options-parent" :init-val="'日'" />
      </div>
      <SelectOptions class="select-options-device" :init-val="deviceList[0].key" :list="deviceList" />
      <div class="chart-wrapper">
        <ChartData :options="optionsLeft" :width="700" :height="490" />
      </div>
    </div>
    <div class="right-chart-st">
      <div class="title-ft">
        <span class="title-icon"></span>
        <span class="font-value-cold">补水监测</span>
        <SelectOptions class="select-options-parent" :init-val="'日'" />
      </div>
      <div class="chart-wrapper">
        <ChartData :options="optionsRight" :width="700" :height="535" />
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

const deviceList = ref<Array<{ [key: string]: string }>>([
  {
    key: '1#空气热源泵',
    value: '1',
  },
  {
    key: '2#空气热源泵',
    value: '2',
  },
  {
    key: '3#空气热源泵',
    value: '3',
  },
]);

// console.log(props);

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

const yData1: Array<number> = [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40];

const yData2: Array<number> = [10, 22, 30, 45, 10, 20, 31, 40, 10, 20, 30, 43, 10, 22, 30, 20];

const optionsLeft = ref<any>({
  color: ['#287ce4', '#41e4de'],
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
            <span style="color: #41e4de; font-size: 12px">${params[0].value}°C</span>
        </div>
        <div>
            <span style="color: #ffffff; font-size: 12px">${params[1].seriesName}:</span>
            <span style="color: #41e4de; font-size: 12px">${params[1].value}°C</span>
        </div>
      `;
    },
  },
  legend: {
    icon: 'rect',
    position: 'middle',
    top: 10,
    type: 'plain',
    itemHeight: 2,
    itemWidth: 14,
    itemGap: 30,
    textStyle: {
      fontSize: 12,
      color: '#eff7ff',
      fontWeight: 'bold',
    },
    data: ['冷冻水供水', '冷冻水回水'],
  },
  grid: {
    top: '8%',
    left: '5%',
    right: '5%',
    bottom: '10%',
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
      // max:20,
      name: '°C',
      nameTextStyle: {
        color: '#D8D8D8',
        fontSize: 12,
        fontFamily: 'Source Han Sans CN-Regular',
        align: 'left',
        verticalAlign: 'center',
      },
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
        show: true,
        textStyle: {
          color: '#fdfeff',
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '冷冻水供水',
      type: 'line',
      showAllSymbol: false,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 0,
      data: yData1,
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
                color: '#287ce4',
              },
              {
                offset: 0.5,
                color: '#287ce4',
              },
              {
                offset: 1,
                color: '#287ce4',
              },
            ]),
          },
        },
      },
    },
    {
      name: '冷冻水回水',
      type: 'line',
      showAllSymbol: false,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 0,
      data: yData2,
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
        },
      },
    },
  ],
});

const optionsRight = ref<any>({
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
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '10%',
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
        show: true,
        textStyle: {
          color: '#fdfeff',
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '用热水',
      type: 'line',
      showAllSymbol: false,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 0,
      data: yData1,
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
    },
  ],
});

onBeforeMount(() => {});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.cold-tab {
  width: 100%;
  height: 610px;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  .left-calculate {
    width: 49%;
    height: 610px;
    border: 1px solid rgba(33, 44, 60, 1);
    box-sizing: border-box;
    background-color: rgba(9, 15, 23, 0.3);
    position: relative;
    .title-ft {
      // line-height: 50px;
      height: 50px;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      display: flex;
      padding: 0 20px;
      box-sizing: border-box;
      position: relative;
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
      .font-value-cold {
        color: rgba(234, 245, 255, 1);
        font-size: 16px;
        margin-left: 15px;
        margin-top: 17px;
      }
      .select-options-parent {
        position: absolute;
        // margin-right: 30px;
        top: 9px;
        right: 20px;
      }
    }
    .select-options-device {
      position: absolute;
      top: 65px;
      right: 20px;
    }
    .chart-wrapper {
      width: 100%;
      height: 520px;
      margin-top: 60px;
    }
  }
  .right-chart-st {
    width: 49%;
    height: 610px;
    border: 1px solid rgba(33, 44, 60, 1);
    box-sizing: border-box;
    background-color: rgba(9, 15, 23, 0.3);
    .title-ft {
      // line-height: 50px;
      height: 50px;
      border-bottom: 1px solid rgba(29, 38, 52, 1);
      display: flex;
      padding: 0 20px;
      box-sizing: border-box;
      position: relative;
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
      .font-value-cold {
        color: rgba(234, 245, 255, 1);
        font-size: 16px;
        margin-left: 15px;
        margin-top: 17px;
      }
      .select-options-parent {
        position: absolute;
        // margin-right: 30px;
        top: 9px;
        right: 20px;
      }
    }
    .chart-wrapper {
      width: 100%;
      height: 550px;
      margin-top: 20px;
    }
  }
}
</style>
