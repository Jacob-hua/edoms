<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="570" min-height="272">
    <template #operation>
      <div class="wrap-header">
        <div class="wrap-header-divide">
          <div v-for="(item, index) in categories" :key="item.label" :class="{ active: activeCategory === index }"
            class="divide-item" @click="changeTab(index)">
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>
    <div class="wrap-body" style="width: 100%; height: 100%">
      <div class="wrapper">
        <el-select v-if="pointOptions && pointOptions.length > 0" v-model="vModelpoint" @change="changeSelectPoint"
          class="select-device" placeholder="Select" size="small">
          <el-option v-for="item in pointOptions" :key="item.value" :label="item.label" :value="item.indicators" />
        </el-select>
        <div class="left-tab">
          <div v-for="({ label }, index) in parameterConfigs" :key="index" class="button-tab"
            :class="{ active: activeTab === index }" :title="label" @click="changeActiveTab(index)">
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

import 'echarts/lib/component/dataZoom';

import BusinessCard from '../../BusinessCard.vue';
import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import locales from './locales';
import { MIndicatorItemConfig, MOperationalParameters, MParameterItemConfig } from './type';

const props = defineProps<{
  config: MOperationalParameters;
}>();
// 国际化
const { setMessage, t } = useApp(props);
setMessage(locales);
const scrollMain = ref();
const wrap = ref();

const { request } = useApp(props);

const { fetchCurveData } = apiFactory(request);

const categories = computed<any[]>(() => props.config.classify);

const activeCategory = ref<number>(0);


const option = ref<ECOption>({});

const lineUnit = ref<string[]>([]);

const pointOptions = ref([])

const vModelpoint = ref('')

const currentIndicators = ref()

const parameterConfigs = computed<MParameterItemConfig[]>(() => {
  if (!props.config.classify) return [];
  if (props.config.classify.length == 0) return [];
  const result = props.config.classify[activeCategory.value].tabName;
  if (result) {
    arrangePointData()
    return result;
  }
  pointOptions.value = []
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
  arrangePointData()
  activeTab.value = 0;
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
    dataCodes: !isHasPoint() ? data[activeTab.value].indicators.map((e: any) => e.property) : currentIndicators.value,
    tsUnit: 'H',
    ts: '1',
  });
  let chartSeries = [];
  chartSeries = result.map(({ propCode, dataList }) => {
   return data[activeTab.value].indicators?.map((indicator,index)=>{
    // const codeIndex = data[activeTab.value].indicators.findIndex((item: any) => indicator.property == propCode);
    const codeIndex =indicator.property == propCode ? index : -1
    const name = indicator.label;
    const color = indicator.color;
    lineUnit.value.push(data[activeTab.value].indicators[codeIndex]?.unit);
    const lineType = data[activeTab.value].lineType ?? 'line';
    return {
      name: name ? name : `${t('未命名')}${index}`,
      type: lineType,
      showSymbol: false,
      smooth: true,
      color,
      barWidth: '14',
      data: dataList.map(({ time, value }) => [
        new Date(Number(time)),
        formatPrecision(+value, data[activeTab.value].indicators[codeIndex]?.precision ?? ''),
      ]),
    };
    })
    
  });
  option.value = generateOption(chartSeries[0]);
};

const isHasPoint = () => {
  const result = props.config.classify[activeCategory.value].tabName;
  return result[activeTab.value].point?.length > 0
}

const arrangePointData = () => {
  const result = props.config.classify[activeCategory.value].tabName;
  const currentPoint = result[activeTab.value]?.point || []
  pointOptions.value = currentPoint.length > 0 ? currentPoint : []
  if (pointOptions.value.length > 0) {
    vModelpoint.value = pointOptions.value[0].label
  } else {
    vModelpoint.value = ''
  }
}

const changeSelectPoint = (val) => {
  currentIndicators.value = [...val].map((e: any) => e.property)
  console.log('currentIndicators.value',currentIndicators.value)
  getHistoryData()
}

const { flush } = useIntervalAsync(getHistoryData, intervalDelay.value);

watch(
  () => activeIndicatorConfig.value,
  () => {
    getHistoryData();
  }
);

function generateOption(series: any[] = []): ECOption {
  const legends = series.map(({ name }) => name);
  const colors = series.map(({ color }) => color);
  let end = 0;
  if (series.length < 2) {
    end = 100;
  } else if ([2, 3].includes(series.length)) {
    end = 100 - series.length * 20;
  } else {
    end = 100 - series.length * 18;
  }
  end = end < 20 ? 20 : end;

  const dataZoom =
    series.length > 0 && series[0].type === 'bar'
      ? [
        {
          // xAxisIndex: [0],
          // show: true, //flase直接隐藏图形
          type: 'inside',
          backgroundColor: 'transparent',
          brushSelect: false, // 是否开启刷选功能
          zoomLock: true, // 是否锁定选择区域大小
          height: 10,
          //left: 'center', //滚动条靠左侧的百分比
          bottom: 0,
          start: 0, //滚动条的起始位置
          end, //滚动条的截止位置（按比例分割你的柱状图x轴长度）
          // handleStyle: {// 滚动条两侧操作按钮样式
          //   color: 'rgba(40, 124, 232, 1)',
          //   borderColor: 'rgba(40, 124, 232, 1)',
          // },
          // fillerColor: 'rgba(40, 124, 232, 1)',// 背景颜色
          borderColor: 'transparent',
          showDetail: false,
          dataBackground: {
            areaStyle: {
              opacity: 0,
            },
            lineStyle: {
              color: 'transparent',
            },
          },
        },
      ]
      : [];

  const option: ECOption = {
    legend: {
      data: legends,
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 14,
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
    dataZoom,
    series,
  };
  console.log('option',option)
  return option;
}

const scrollMainWidth = ref<number>(0);
const scollWith = ref<number>(0);
const wrapWith = ref<number>(0);
// const navWidth = ref<number>(0);
const showLeft = ref<boolean>(false);
const showRight = ref<boolean>(false);
const distance = ref<number>(0);

const tabCount = computed<number>(() => {
  if (props.config.classify.length > 4) return 4;
  else if (props.config.classify.length < 2) return 2;
  else return props.config.classify.length;
});

const tabWidth = computed(() => scrollMainWidth.value / tabCount.value + 'px');

// const listTabWidth = computed(() => {
//   if (categories.value && categories.value.length * (scrollMainWidth.value / 4) <= scrollMainWidth.value)
//     return scrollMainWidth.value + 'px';
//   else {
//     return (scrollMainWidth.value / 4) * (categories.value ? categories.value.length : 0) + 'px';
//   }
// });

// const moveMethod = (flag: string) => {
//   // 移动
//   distance.value += flag === 'left' ? -(scrollMainWidth.value / 4) : scrollMainWidth.value / 4;
//   convertArrow();
// };

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
});

onMounted(() => {
  flush();
  if (!scrollMain.value) {
    return;
  }
  scrollMainWidth.value = scrollMain.value.clientWidth;
  colorCardObserver.observe(scrollMain.value);
  scollWith.value = scrollMain.value.offsetWidth;
  wrapWith.value = wrap.value.offsetWidth;
  wrapWith.value <= scollWith.value && (showLeft.value = false);
  showRight.value = categories.value.length > 4 ? true : false;
  convertArrow();
});
</script>

<style lang="scss" scoped>
.wrap-info {
  width: 100%;
  height: 100%;
}

.wrap-body {
  width: 100%;

  .wrap-header {
    margin-left: 20px;
    margin-top: 10px;
    width: calc(100% - 40px);
    min-height: 31px;
    border-top: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    border-bottom: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    display: flex;
    align-items: center;

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
    position: relative;

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
      position: relative;
      border-right: 1px solid rgba(255, 255, 255, 0.12);

      // &> ::after {
      //   content: '';
      //   position: absolute;
      //   height: 100%;
      //   width: 1px;
      //   right: 5px;
      //   top: -10px;
      //   background-color: rgba(255, 255, 255, 0.12);
      // }

      .button-tab {
        width:100%;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-size: cover;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 10px 0;
        box-sizing: border-box;
        font-size: 14px;
        min-height: 34px;

        &.active {
          color: #1b9aff;
          border-right: 2px solid #1b9aff;
          background-color: rgba(255, 255, 255, 0.08);
          z-index: 10;
        }
      }
    }
  }

  .charts {
    flex-grow: 1;
    height: 100%;
    margin-top: 20px;
    margin-right: 20px;
  }
}

.wrap-header-divide {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .divide-item {
    margin: 0 5px;
    font-size: 14px;
    padding: 4px 0;
    box-sizing: content-box;
  }

  .active {
    color: #1b9aff;
    border-bottom: 2px solid #1b9aff;
  }
}

.select-device {
  position: absolute;
  right: 15px;
  top: 0px;
  background-color: #1F212C;
}

:deep(.wrap-body .select-device .el-input__wrapper) {
  background-color: #1F212C !important;
}
</style>
