<template>
  <div class="wrap-control">
    <div class="top">
      <span class="label">{{ t('费用对比') }}</span>
    </div>
    <div class="wrap-tab">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        :class="['tab', { active: activeTab === index }]"
        @click="changeTab(index)"
      >
        {{ item }}
      </div>
    </div>
    <div class="chart-box">
      <EdomsCharts class="charts" :option="chartData"></EdomsCharts>
    </div>
    <div v-if="tableData && tableData.length > 0" class="table-box">
      <record-table
        :title="'运行时间'"
        :long-width="'214px'"
        :is-light="false"
        :text-cols="textCols"
        :table-cols="amCols"
        :table-data="tableData"
      ></record-table>
      <record-table
        :hide-col="true"
        :text-cols="[]"
        :is-light="false"
        :table-cols="pmCols"
        :table-data="tableData"
      ></record-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { formatDate } from '@edoms/utils';

import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import RecordTable from './components/RecordTable.vue';
import apiFactory from './api';
import { CostComparsionDetail } from './type';
const props = defineProps<{
  config: CostComparsionDetail;
}>();

const { request } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

import useI18n from '../../useI18n';
const { t } = useI18n();

//点位属性
const indicatorProperty = computed(() =>
  props.config.indicators?.map(({ property }: { property: string }) => property)
);

//点位
const indicators = computed(() => props.config.indicators ?? []);

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const testCodes = ref([
  'PGY02014_SZL01001_STZL001001_U00000000_EQ000000000000_MPYDL2001',
  'PGY02014_SZL01001_STZL001001_U00000000_EQ000000000000_MP0002004',
]);

//切换tab
const activeTab = ref(0);
const tabs = ref(['用电量对比', '电费对比']);

const changeTab = (index: number) => {
  if (activeTab.value === index) return;
  activeTab.value = index;
  if (activeTab.value === 0) {
    testCodes.value = indicatorProperty.value.map((item) => item);
  } else {
    testCodes.value = indicatorProperty.value.map((item) => item + '-charge');
  }
  getCostData();
};

const getCostData = async () => {
  const time = formatDate(new Date(), 'YYYY-MM-DD');
  const requestParam = { codes: indicatorProperty.value.join(','), time };
  const result = await fetchExecuteApi({ apiCode: 'queryCostComparison', requestParam });
  const serise = indicators.value?.map((item, index) => {
    lineUnit.value.push(item?.unit ?? '');
    return {
      name: item.label ? item.label : `未命名${index}`,
      type: 'line',
      showSymbol: true,
      smooth: false,
      color: item.color,
      data: result[testCodes.value[index]],
    };
  });
  chartData.value = initChartData(result.xList, serise) as ECOption;
  const tableCodesValue: Record<string, any>[] = [];
  Object.keys(result).forEach((key) => {
    if (testCodes.value.indexOf(key) > -1) {
      tableCodesValue.push(result[key]);
    }
  });
  initTableData(result.xList, tableCodesValue);
};

//整理表格数据
const tableData: any = ref();
const amCols: any = ref([]);
const pmCols: any = ref([]);
const textCols = ref(['优化策略用电量(kWh)', '未优化前用电量(kWh)']);

const initTableData = (xList: string[], data: any) => {
  const header = [...xList];
  amCols.value = header.splice(0, 11);
  pmCols.value = header.splice(0, 13);
  tableData.value = data.map((item: any) => {
    const currentItem: Record<string, any> = {};
    item.forEach((arr: string[]) => {
      currentItem[arr[0]] = arr[1] || '-';
    });
    return currentItem;
  });
};

//整理曲线图数据
const chartData = ref<ECOption>({});
const lineUnit = ref<string[]>([]);

const initChartData = (xAxisData: string[], series: any[] = []) => {
  if (!indicators.value || indicators.value.length <= 0) return;
  const legends = series.map(({ name }) => name);
  const colors = series.map(({ color }) => color);
  return {
    legend: {
      data: legends,
      color: colors,
      textStyle: {
        color: '#ffffff85',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11,34,52,0.9)',
      borderWidth: 1,
      borderColor: 'rgb(73, 73, 73)',
      textStyle: {
        color: '#ffffff85',
      },
      formatter: (params: any) => {
        let content = params[0].axisValueLabel;
        for (const i in params) {
          content +=
            '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value[1] + lineUnit.value[Number(i)];
        }
        return content;
      },
    },
    grid: {
      left: '2%',
      right: '1%',
      top: 30,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      // boundaryGap: [0, '100%'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ffffff45',
        },
      },
      axisLine: {
        show: true,
      },
    },
    series,
  };
};

useIntervalAsync(getCostData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-control {
  width: 100%;
  height: 100%;
  background-color: #272d36;
  .top {
    height: 44px;
    background-color: #333c50;
    color: #ffffffd9;
    line-height: 44px;
    padding-left: 20px;
  }

  :deep(.el-dialog__header) {
    background-color: #333c50;
    .top {
      color: #ffffffd9;
    }
  }
  .wrap-tab {
    width: 260px;
    height: 36px;
    margin-top: 20px;
    margin-left: 20px;
    display: flex;
    border: 1px solid #1b9aff;
    border-radius: 4px;
    .tab {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1b9aff;
      cursor: pointer;
      &.active {
        background: #1b9aff;
        color: #fff;
      }
    }
  }

  .chart-box {
    width: calc(100% - 80px);
    height: 280px;
    margin-left: 40px;
    margin-top: 20px;
    .charts {
      width: 100%;
      height: 100%;
    }
  }

  .table-box {
    width: calc(100% - 40px);
    margin-left: 20px;
    margin-top: 20px;
    .record-table-container {
      margin-bottom: 20px;
    }
  }
}
</style>
