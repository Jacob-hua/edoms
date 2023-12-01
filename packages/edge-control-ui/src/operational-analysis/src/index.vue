<template>
  <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="570" min-height="272">
    <template #operation>
      <div class="wrap-header">
        <div class="wrap-header-divide">
          <div
            v-for="(item, index) in categories"
            :key="item.label"
            :class="{ active: activeFirstTab === index }"
            class="divide-item"
            @click="changeFirstTab(index)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>
    <div class="wrap-body" style="width: 100%; height: 100%">
      <div class="wrapper">
        <el-select
          v-if="categoriesThirdTabs && categoriesThirdTabs.length > 0"
          v-model="selectPointLabel"
          class="select-device"
          placeholder="Select"
          size="small"
          @change="changeSelectPoint"
        >
          <el-option
            v-for="item in categoriesThirdTabs"
            :key="item.value"
            :label="item.label"
            :value="item.indicators"
          />
        </el-select>
        <div class="left-tab">
          <div
            v-for="({ label }, index) in categoriesSecondTabs"
            :key="index"
            class="button-tab"
            :class="{ active: activeSecondTab === index }"
            :title="label"
            @click="changeSecondTab(index)"
          >
            {{ label }}
          </div>
        </div>
        <EdomsCharts class="charts" :option="chartSeries"></EdomsCharts>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatDate, formatDateRange } from '@edoms/utils';

import 'echarts/lib/component/dataZoom';

import BusinessCard from '../../BusinessCard.vue';
import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import locales from './locales';
import { MOperationalParameters } from './type';

const props = defineProps<{
  config: MOperationalParameters;
}>();
// 国际化
const { setMessage } = useApp(props);
setMessage(locales);

const { request } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

const chartSeries = ref<ECOption>({});

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

//一级菜单
const activeFirstTab = ref<number>(0);
const categories = computed(() => props.config.classify || []);

const changeFirstTab = (index: number) => {
  activeFirstTab.value = index;
  activeSecondTab.value = 0;
  formatFirstTabConfig();
  changeSecondTab(0);
};

//二级菜单
const categoriesSecondTabs = ref();
const activeSecondTab = ref<number>(0);

const formatFirstTabConfig = () => {
  if (!categories.value || categories.value.length <= 0) return;
  categoriesSecondTabs.value = categories.value[activeFirstTab.value]?.tabName || [];
};

const changeSecondTab = (index: number) => {
  activeSecondTab.value = index;
  selectPointCode.value = categoriesSecondTabs.value?.[activeSecondTab.value]?.point[0]?.indicators;
  getHistoryData();
};

//三级菜单
const selectPointLabel = ref();
const selectPointCode = ref();
const isHasPoint = () => {
  const result = props.config.classify[activeFirstTab.value].tabName;
  return result[activeSecondTab.value]?.point?.length > 0;
};

const categoriesThirdTabs = computed(() => {
  if (isHasPoint()) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    selectPointLabel.value = categoriesSecondTabs.value?.[activeSecondTab.value]?.point[0]?.label;
    return categoriesSecondTabs.value?.[activeSecondTab.value]?.point;
  } else {
    return [];
  }
});

const changeSelectPoint = (val: any) => {
  selectPointCode.value = val;
  getHistoryData();
};

const formatCodes = () => {
  let codes = '';
  if (isHasPoint()) {
    codes = selectPointCode.value?.map(({ property }: { property: string }) => property)?.[0];
  } else {
    codes = categoriesSecondTabs.value[activeSecondTab.value]?.indicators?.map(
      ({ property }: { property: string }) => property
    )?.[0];
  }
  return codes;
};

const formatCurrentSerise = (type: string, list: Record<string, any>, index: number) => {
  if (type === 'loadForecasting') {
    return list.map((item: any[]) => item[index + 1]);
  } else if (type === 'strategyChart') {
    return list[index].data;
  } else {
    return list;
  }
};

const formatChartSerise = (apiCode: string, data: any, codes: string) => {
  const legends = isHasPoint()
    ? selectPointCode.value?.map(({ label }: { label: string }) => label)
    : categoriesSecondTabs.value[activeSecondTab.value]?.indicators?.map(({ label }: { label: string }) => label);
  const colors = isHasPoint()
    ? selectPointCode.value?.map(({ color }: { color: string }) => color)
    : categoriesSecondTabs.value[activeSecondTab.value]?.indicators?.map(({ color }: { color: string }) => color);
  const time = apiCode === 'loadForecasting' ? data.time : apiCode === 'strategyChart' ? data.timeList : data.xList;
  const serieList =
    apiCode === 'loadForecasting' ? data.dataList : apiCode === 'strategyChart' ? data.dataList : data[codes];
  const type = apiCode === 'loadForecasting' ? 'line' : apiCode === 'strategyChart' ? 'bar' : 'bar';
  const serise = legends.map((item: string, index: number) => {
    return {
      name: item,
      type: type,
      stack: 'one',
      itemStyle: {
        color: colors[index],
      },
      data: formatCurrentSerise(apiCode, serieList, index),
    };
  });
  return baseChartOptions(legends, colors, time, serise);
};

//获取曲线数据
const apis = [
  'loadForecasting',
  'strategyChart',
  'queryEnergyEfficiencyMonitoringGraphOfDay',
  'queryEnergyEfficiencyMonitoringGraphOfDay',
];
const getHistoryData = async () => {
  if (!categoriesSecondTabs.value && categoriesSecondTabs.value.length <= 0) return;
  const params = {
    dataCodes: formatCodes(),
    time: formatDate(new Date(), 'YYYY-MM-DD'),
  };
  const { start, end } = formatDateRange(new Date(), 'day', 'YYYY-MM-DD HH:mm:ss');
  const equipmentParams = {
    codes: formatCodes(),
    startTime: start,
    endTime: end,
    ts: 1,
    tsUnit: 'H',
  };
  const apiCode = apis[activeFirstTab.value];
  const requestParam =
    apiCode === 'strategyChart'
      ? { tpl: 'strategyDataCodeTpl' }
      : apiCode === 'queryEnergyEfficiencyMonitoringGraphOfDay'
      ? equipmentParams
      : params;
  const result = await fetchExecuteApi({ apiCode, requestParam });
  if (!result || Object.keys(result).length <= 0) return;
  chartSeries.value = formatChartSerise(apiCode, result, equipmentParams.codes) as ECOption;
};

const baseChartOptions = (legends: any, colors: any, xAxisData: string[], series: any) => {
  return {
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
      backgroundColor: 'rgba(11,34,52,0.9)',
      borderWidth: 1,
      borderColor: 'rgb(73, 73, 73)',
      textStyle: '#fff',
      formatter: (params: any) => {
        let content = params[0].axisValueLabel;
        for (const i in params) {
          // const unit = lineUnit.value[Number(i)] ? lineUnit.value[Number(i)] : '';
          const unit = 'KWh';
          content += '<br/>' + params[i].marker + params[i].seriesName + ': ' + (params[i].value ?? '-') + unit;
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
      data: xAxisData,
      type: 'category',
      splitLine: {
        show: false,
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 1,
      },
    },
    yAxis: {
      type: 'value',
      name: 'KWh',
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
    // dataZoom,
    series,
  };
};

watch(
  () => props.config.classify,
  () => {
    formatFirstTabConfig();
  },
  { immediate: true }
);

useIntervalAsync(getHistoryData, intervalDelay.value);
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
        width: 100%;
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
  background-color: #1f212c;
}

:deep(.wrap-body .select-device .el-input__wrapper) {
  background-color: #1f212c !important;
}
</style>
