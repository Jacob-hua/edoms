<template>
  <div class="pump-list">
    <div class="pump-title">
      <div class="left-icon-name">
        <div :class="props.list.type"></div>
        <span class="left-name">{{ props.list.name }}</span>
      </div>
      <div class="right-title-tab">
        <div
          v-for="(itm, idx) in props.list.chartList"
          :key="idx"
          :class="['tab-item', tabIdx === idx ? 'active' : '']"
          @click="handlerToChoose(idx)"
        >
          <span class="item-name">{{ itm.name }}</span>
        </div>
      </div>
    </div>
    <div class="pump-content">
      <div class="left-content">
        <div v-for="(itm, idx) in props.list.chartList" :key="idx" class="content-item">
          <div class="name-ft">{{ itm.name }}</div>
          <div class="value-ft">{{ itm.value }}</div>
        </div>
      </div>
      <div class="right-chart">
        <ChartData :options="getChartOptions" :width="600" :height="190" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, withDefaults } from 'vue';
import * as echarts from 'echarts/core';

import ChartData from './chartData.vue';

const props = withDefaults(
  defineProps<{
    list: { [key: string]: any };
  }>(),
  {
    list: () => ({}),
  }
);

const tabIdx = ref<number>(0);

// const options = ref<any>({
// });

const getChartOptions = computed(() => {
  return {
    color: ['#41e4de'],
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
    legend: {
      icon: 'rect',
      position: 'middle',
      // top: 10,
      type: 'plain',
      itemHeight: 2,
      itemWidth: 14,
      itemGap: 30,
      textStyle: {
        fontSize: 12,
        color: '#eff7ff',
        fontWeight: 'bold',
      },
      data: [props.list.chartList[tabIdx.value].name],
    },
    grid: {
      top: '20%',
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
          color: 'rgba(234, 245, 255, 0.5)',
        },
        splitLine: {
          show: false,
        },
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: props.list.chartList[tabIdx.value].xAisData,
      },
    ],

    yAxis: [
      {
        type: 'value',
        max: props.list.chartList[tabIdx.value].maxValue + 10,
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
            color: 'rgba(234, 245, 255, 0.5)',
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: props.list.chartList[tabIdx.value].name,
        type: 'line',
        showAllSymbol: false,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 0,
        data: props.list.chartList[tabIdx.value].chartData,
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
              name: '预警值',
              // type:'average',
              yAxis: props.list.chartList[tabIdx.value].maxValue,
              lineStyle: {
                type: 'solid',
                color: '#4193F7',
                width: 1.5,
              },
              label: {
                show: true,
                position: 'middle',
                // color: '#F5F7FA',
                fontSize: 14,
                formatter: ['{text|预警值: }', `{num|${props.list.chartList[tabIdx.value].maxValue}}`].join(''),
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
                //   return `${'预警值: ' + param.value}`;
                // },
              },
            },
          ],
        },
      },
    ],
  };
});

const handlerToChoose = (index: number) => {
  tabIdx.value = index;
};

onBeforeMount(() => {});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.pump-list {
  width: 100%;
  height: 100%;
  background-color: rgba(9, 15, 23, 0.3);
  border: 1px solid rgba(33, 44, 60, 1);
  .pump-title {
    width: 100%;
    height: 62px;
    border-bottom: 1px solid rgba(33, 44, 60, 1);
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
    .left-icon-name {
      width: 200px;
      line-height: 62px;
      margin-right: 15px;
      color: rgba(234, 245, 255, 1);
      font-size: 16px;
      position: relative;
      display: flex;
      align-items: center;
      .coldPump {
        background-image: url('../assets/icon_pump.png');
        width: 40px;
        height: 26px;
        background-size: 100% 100%;
      }
      .coldTower {
        background-image: url('../assets/icon_tower.png');
        width: 40px;
        height: 29px;
        background-size: 100% 100%;
      }
      .coldSet {
        background-image: url('../assets/icon_set.png');
        width: 40px;
        height: 39px;
        background-size: 100% 100%;
      }
      //   &::before {
      //     content: '';
      //     background-image: url('../assets/itm-tab-icon.png');
      //     width: 40px;
      //     height: 40px;
      //     background-size: 100% 100%;
      //     position: absolute;
      //     top: 10px;
      //   }
      .left-name {
        margin-left: 10px;
      }
    }

    .right-title-tab {
      width: calc(100% - 200px);
      height: 42px;
      margin-top: 10px;
      display: flex;
      .tab-item {
        padding: 0 5px;
        margin-right: 10px;
        line-height: 42px;
        color: rgba(234, 245, 255, 0.5);
        font-size: 14px;
        cursor: pointer;
        &.active {
          color: rgba(234, 245, 255, 1);
          border-bottom: 2px solid rgba(0, 163, 255, 1);
        }
      }
    }
  }
  .pump-content {
    width: 100%;
    height: calc(100% - 62px);
    padding: 20px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .left-content {
      width: 200px;
      margin-right: 15px;
      overflow: hidden;
      .content-item {
        width: 100%;
        height: 32px;
        background-color: rgba(20, 27, 37, 0.4);
        box-sizing: border-box;
        border: 1px solid rgba(33, 43, 59, 1);
        margin-bottom: 10px;
        display: flex;
        .name-ft {
          height: 32px;
          width: 40%;
          line-height: 32px;
          text-align: center;
          color: rgba(234, 245, 255, 0.5);
          font-size: 14px;
        }
        .value-ft {
          height: 32px;
          width: 60%;
          line-height: 32px;
          text-align: center;
          color: rgba(65, 228, 222, 1);
          font-size: 14px;
          border-left: 1px solid rgba(33, 43, 59, 1);
        }
      }
    }
    .right-chart {
      width: calc(100% - 215px);
      height: 100%;
    }
  }
}
</style>
