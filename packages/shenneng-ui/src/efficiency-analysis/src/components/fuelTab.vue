<template>
  <div class="fuel-tab">
    <div class="title-ft">
      <span class="title-icon"></span>
      <span class="font-value-cold">用能监测</span>
    </div>
    <div class="title-fuel">
      <span class="title-name">用电总计：</span>
      <span class="title-font">714.71kWh</span>
    </div>
    <SelectOptions class="select-options-parent" :init-val="'日'" @on-select-change="handlerToChange" />
    <div class="chart-bg-wrapper">
      <div class="race-list">
        <div
          v-for="(itm, idx) in raceList"
          :key="idx"
          class="race-item"
          :style="{ width: itm.width, backgroundColor: itm.bgColor }"
        >
          <span class="title-name">{{ itm.key }}</span>
          <span class="title-font" :style="{ color: itm.color }">{{ itm.value }}</span>
        </div>
      </div>
      <ChartData :options="options" :width="1424" :height="490" />
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

const yData: Array<number> = [10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40, 10, 20, 30, 40];

const raceList = ref<Array<{ [key: string]: any }>>([
  {
    key: '峰',
    value: 120.23,
    color: 'rgba(40, 124, 231, 1)',
    bgColor: 'rgba(40, 124, 231, 0.1)',
    width: '20%',
  },
  {
    key: '平',
    value: 120.23,
    color: 'rgba(65, 228, 222, 1)',
    bgColor: 'rgba(65, 228, 222, 0.1)',
    width: '25%',
  },
  {
    key: '谷',
    value: 120.23,
    color: 'rgba(29, 193, 41, 1)',
    bgColor: 'rgba(29, 193, 41, 0.1)',
    width: '30%',
  },
  {
    key: '尖',
    value: 120.23,
    color: 'rgba(193, 114, 29, 1)',
    bgColor: 'rgba(193, 114, 29, 0.1)',
    width: '25%',
  },
]);

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
            <span style="color: #41e4de; font-size: 12px">${params[0].value}°C</span>
        </div>
      `;
    },
  },
  grid: {
    top: '5%',
    right: '1.5%',
    bottom: '1%',
    left: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    // boundaryGap: ['0', '10%'],
    data: xData,
    axisLabel: {
      interval: 0,
      textStyle: {
        color: '#CEDDF2',
        fontSize: 12,
      },
    },
    // x轴线的颜色为   rgba(255,255,255,.2)
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false, // 去除刻度线
    },
  },
  yAxis: {
    type: 'value',
    name: '°C',
    nameTextStyle: {
      color: '#D8D8D8',
      fontSize: 12,
      fontFamily: 'Source Han Sans CN-Regular',
      align: 'left',
      verticalAlign: 'center',
    },
    // boundaryGap: ['0', '10%'],
    axisTick: { show: false },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#CEDDF2',
        fontSize: 12,
      },
    },
    // y轴分割线的颜色
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)',
        type: 'dashed',
      },
    },
  },
  series: [
    {
      name: '2021年',
      type: 'bar',
      barWidth: '25%',
      // showBackground: true,
      // 设置拐点颜色以及边框
      itemStyle: {
        borderColor: 'rgba(40, 124, 232, 1)',
        borderWidth: 1,
        color: new echarts.graphic.LinearGradient(
          0,
          0,
          0,
          1,
          [
            {
              offset: 0,
              color: 'rgba(40, 124, 232, 0.5)',
            },
            {
              offset: 1,
              color: 'rgba(40, 124, 232, 0.5)',
            },
          ],
          false
        ),
      },
      data: yData,
    },
  ],
});

const handlerToChange = (itm: string) => {
  if (itm === '日') {
    options.value.xAxis.data = [
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
    options.value.xAxis.data = [
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
    options.value.xAxis.data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    options.value.series[0].data = [29, 10, 30, 40, 15, 20, 80, 40, 10, 20, 20, 40];
  }
};

onBeforeMount(() => {});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.fuel-tab {
  width: 100%;
  height: 610px;
  margin-top: 30px;
  border: 1px solid rgba(33, 44, 60, 1);
  box-sizing: border-box;
  background-color: rgba(9, 15, 23, 0.3);
  position: relative;
  .title-ft {
    width: 100%;
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
    .font-value-cold {
      color: rgba(234, 245, 255, 1);
      font-size: 16px;
      margin-left: 15px;
    }
  }
  .title-fuel {
    width: 100%;
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    text-align: center;
    .title-name {
      color: rgba(234, 245, 255, 1);
      font-size: 14px;
      margin-right: 5px;
    }
    .title-font {
      color: rgba(65, 228, 222, 1);
      font-size: 18px;
      font-weight: 700;
    }
  }
  .select-options-parent {
    position: absolute;
    top: 65px;
    right: 20px;
  }
  .chart-bg-wrapper {
    width: 100%;
    height: 490px;
    margin-top: 10px;
    position: relative;
    .race-list {
      width: calc(100% - 4.3% - 2.5%);
      height: calc(100% - 10%);
      left: 4.3%;
      top: 5%;
      display: flex;
      justify-content: space-between;
      position: absolute;
      .race-item {
        height: 100%;
        padding-top: 20px;
        text-align: center;
        box-sizing: border-box;
        .title-name {
          color: rgba(234, 245, 255, 0.5);
          font-size: 14px;
          margin-right: 10px;
        }
        .title-name {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
