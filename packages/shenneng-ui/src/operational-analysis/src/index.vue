<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-06-08 10:36:33
-->
<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="570" min-height="367">
    <div class="wrap-body" style="width: 100%; height: 100%">
      <div class="wrap-header">
        <div class="wrap-divide">
          <div v-for="item in divideArr" :key="item" class="divide"></div>
        </div>
        <div v-show="showRight" class="caret-left btn" @click="moveMethod('right')"></div>
        <div id="scrollRef" ref="scrollMain" class="wrap-scroll">
          <div
            ref="wrap"
            class="list-tab"
            :style="{
              'margin-left': distance + 'px',
              width: listTabWidth,
            }"
          >
            <div v-for="(item, index) in categories" :key="item.label" class="wrap-tab">
              <div class="tab" :class="{ active: activeCategory === index }" @click="changeTab(index)">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
        <div v-show="showLeft" class="caret-right btn" @click="moveMethod('left')"></div>
      </div>
      <div class="wrapper">
        <div class="left-tab">
          <div
            v-for="({ label }, index) in parameterConfigs"
            :key="index"
            class="button-tab"
            :class="{ active: activeTab === index }"
            @click="changeActiveTab(index)"
          >
            {{ label }}
          </div>
        </div>
        <EdomsCharts class="charts" :option="option"></EdomsCharts>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

import { dateRange, formatDateRange, formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

// import EquipmentParameter from './component/EquipmentParameter.vue';
// import SystemParameter from './component/SystemParameter.vue';
import apiFactory from './api';
import { MIndicatorItemConfig, MOperationalParameters, MParameterItemConfig } from './type';

const props = defineProps<{
  config: MOperationalParameters;
}>();

const scrollMain = ref();
const wrap = ref();
// const scrollLeft = ref(0);

const { request } = useApp(props);

// const { fetchHistoryData } = apiFactory(request);
const { fetchCurveData } = apiFactory(request);

const categories = computed<any[]>(() => props.config.classify);
console.log(categories.value);

const activeCategory = ref<number>(0);
const option = ref<ECOption>({});

const lineUnit = ref<string[]>([]);

const parameterConfigs = computed<MParameterItemConfig[]>(() => {
  if (!props.config.classify) return [];
  if (props.config.classify.length == 0) return [];
  const result = props.config.classify[activeCategory.value].tabName;
  if (result) {
    return result;
  }
  return [];
});

const activeIndicatorConfig = ref<Map<string, MIndicatorItemConfig>>(new Map<string, MIndicatorItemConfig>());

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});
const changeTab = (index: number) => {
  if (activeCategory.value === index) return;
  activeCategory.value = index;
  activeTab.value = 0;
  //   option.value = {};
  getHistoryData();
};
const activeTab = ref<number>(0);
const changeActiveTab = (index: number) => {
  activeTab.value = index;
  getHistoryData();
};
const getHistoryData = async () => {
  const date = new Date();
  option.value = {};
  lineUnit.value = [];
  const { start, end } = formatDateRange(date, 'day', 'YYYY-MM-DD');
  const data = parameterConfigs.value;
  if (data.length === 0) return;
  const result = await fetchCurveData({
    startTime: start,
    endTime: end,
    dataCodes: data[activeTab.value].indicators.map((e: any) => e.property),
    // dataCodes: Array.from(activeIndicatorConfig.value.values()).map(({ property }) => property),
    tsUnit: 'H',
    ts: '1',
  });
  let chartSeries = [];
  chartSeries = result.map(({ propCode, dataList }, index) => {
    const codeIndex = data[activeTab.value].indicators.findIndex((item: any) => item.property == propCode);
    const name = data[activeTab.value].indicators[codeIndex]?.label;
    const color = data[activeTab.value].indicators[codeIndex]?.color;
    lineUnit.value.push(data[activeTab.value].indicators[codeIndex]?.unit);
    return {
      name: name ? name : `未命名${index}`,
      type: 'line',
      showSymbol: false,
      smooth: true,
      color: color,
      data: dataList.map(({ time, value }) => [
        new Date(Number(time)),
        formatPrecision(+value, data[activeTab.value].indicators[codeIndex]?.precision ?? ''),
      ]),
    };
  });
  option.value = generateOption(chartSeries);
  //   console.log('我是曲线数据', option.value);
};
const { flush } = useIntervalAsync(getHistoryData, intervalDelay.value);

watch(
  () => activeIndicatorConfig.value,
  () => {
    // updateLineData();
    getHistoryData();
  }
);

function generateOption(series: any[] = []): ECOption {
  const legends = series.map(({ name }) => name);
  const colors = series.map(({ color }) => color);
  return {
    legend: {
      data: legends,
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 4,
      color: colors,
      textStyle: {
        color: '#EFF7FF',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let content = params[0].axisValueLabel;
        for (const i in params) {
          const unit = lineUnit.value[Number(i)] ? lineUnit.value[Number(i)] : '';
          content += '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value[1] + unit;
        }
        return content;
      },
    },
    grid: {
      left: '3%',
      right: '1%',
      top: 30,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      //   data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
      maxInterval: 3600 * 1000 * 3,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
        interval: 2,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(164, 218, 255, 0.2)',
        },
      },
      interval: 3600 * 1000 * 2,
      axisLabel: {
        formatter: '{HH}:{mm}',
        interval: 2,
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 300,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(164, 218, 255, 0.16)',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#FDFEFF',
        fontSize: 10,
      },
      nameTextStyle: {
        color: '#D8D8D8',
        fontWeight: 300,
        fontSize: 10,
      },
    },
    series,
  };
}

const scrollMainWidth = ref<number>(0);
const scollWith = ref<number>(0);
const wrapWith = ref<number>(0);
// const navWidth = ref<number>(0);
const showLeft = ref<boolean>(false);
const showRight = ref<boolean>(false);
const distance = ref<number>(0);

const tabCount = computed<number>(() => {
  console.log(scrollMainWidth.value);
  if (props.config.classify.length > 4) return 4;
  else if (props.config.classify.length < 2) return 2;
  else return props.config.classify.length;
});

const divideArr = computed<Array<number>>(() => {
  const arr = [];
  for (let i = 0; i < tabCount.value + 1; i++) {
    arr.push(i);
  }
  return arr;
});
const tabWidth = computed(() => scrollMainWidth.value / tabCount.value + 'px');

const listTabWidth = computed(
  () => (scrollMainWidth.value / 4) * (categories.value ? categories.value.length : 0) + 'px'
);

const moveMethod = (flag: string) => {
  // 移动
  distance.value += flag === 'left' ? -(scrollMainWidth.value / 4) : scrollMainWidth.value / 4;
  console.log(distance.value);
  convertArrow();
};
const convertArrow = () => {
  /**
   * 左箭头：滚动区域 - 隐藏区域 < 可视区域
   * true：隐藏左箭头(右侧导航已全显示)
   * false：显示左箭头(右侧导航未全显示)
   */
  wrapWith.value = (scrollMainWidth.value / 4) * categories.value.length;
  const rollWidth = wrapWith.value - Math.abs(distance.value);
  showLeft.value = rollWidth <= scollWith.value ? false : true;
  //  右箭头
  showRight.value = distance.value == 0 ? false : true;
};
// 监听html元素变化
const colorCardObserver = new ResizeObserver(() => {
  scrollMainWidth.value = scrollMain.value?.clientWidth ?? 0;
  //   tabWidth.value = scrollMainWidth.value / 2 + 'px';
  //   console.log(tabWidth.value);
});

onMounted(() => {
  flush();
  if (!scrollMain.value) {
    return;
  }
  scrollMainWidth.value = scrollMain.value.clientWidth;
  //   tabWidth = scrollMainWidth.value / 2 + 'px';
  colorCardObserver.observe(scrollMain.value);
  scollWith.value = scrollMain.value.offsetWidth;
  wrapWith.value = wrap.value.offsetWidth;
  //   navWidth.value = document.getElementsByClassName('wrap-tab')[0].offsetWidth ?? 0;
  wrapWith.value <= scollWith.value && (showLeft.value = false);
  showRight.value = categories.value.length > 4 ? true : false;
  convertArrow();
});
</script>

<style lang="scss" scoped>
.wrap-info {
  width: 100%;
  height: 100%;
  //   background-color: green;
}
.wrap-body {
  width: 100%;
  //   height: 300px;
  //   border: 1px solid rgba($color: #215898, $alpha: 0.5);
  .wrap-header {
    margin-left: 20px;
    margin-top: 10px;
    width: calc(100% - 40px);
    min-height: 31px;
    border-top: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    border-bottom: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    display: flex;
    align-items: center;
    position: relative;

    .wrap-divide {
      position: absolute;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: none;
      .divide {
        width: 1px;
        height: 12px;
        background-color: rgba($color: #00a3ff, $alpha: 0.3);
      }
    }
    .btn {
      height: 0;
      width: 0;
      cursor: pointer;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }
    .caret-left {
      position: absolute;
      left: -20px;
      border-left: 8px solid transparent;
      border-right: 8px solid;
      border-right-color: #ffffff85;
    }

    .wrap-scroll {
      display: inline-block;
      width: calc(100% - 10px);
      overflow: hidden;
      vertical-align: bottom;
      //   width: 100%;
      //   overflow: hidden;
      //   display: flex;
      //   align-items: center;
      //   margin: 0 10px;
      .list-tab {
        width: max-content;
        min-width: 770px;
        .wrap-tab {
          //   width: 385px;
          width: v-bind(tabWidth);
          float: left;
          //   text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .tab {
            min-height: 20px;
            min-width: 130px;
            width: 66.5%;
            background: rgba($color: #00a3ff, $alpha: 0.1);
            color: #c4e5f8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            &.active {
              background: rgba(0, 163, 255, 0.16);
              border: 1px solid #007bc0;
              color: #ffffff;
            }
          }
        }
      }
    }

    .caret-right {
      position: absolute;
      right: -20px;
      border-right: 8px solid transparent;
      border-left: 8px solid;
      border-left-color: #ffffff85;
    }
  }
  .wrapper {
    height: calc(100% - 41px);
    display: flex;
    box-sizing: border-box;
    width: 100%;
    .left-tab {
      min-width: 110px;
      height: calc(100% - 20px);
      width: 13.4%;
      margin-left: 20px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      overflow-x: hidden;
      overflow-y: auto;
      .button-tab {
        width: calc(100% - 10px);
        height: 24px;
        margin-bottom: 20px;
        line-height: 24px;
        cursor: pointer;
        background: url('./assets/button_default.png') no-repeat;
        background-size: cover;

        &.active {
          background: url('./assets/button_active.png') no-repeat;
          background-size: cover;
        }
      }
    }
  }
  .charts {
    flex-grow: 1;
    height: 100%;
  }
}
</style>
