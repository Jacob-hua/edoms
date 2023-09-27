<template>
  <div class="wrap-control">
    <div class="top">
      <span class="label">{{ t('费用对比') }}</span>
    </div>
    <!-- <el-dialog
      v-model="dialogVisible"
      align-center
      class="tipDialog"
      width="1400px"
      style="height: 708px; background: #272d36; box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.4); border-radius: 10px"
    >
      <template #header>
        <div class="top">
          <span class="label">{{ t('sideBarList.费用对比') }}</span>
        </div>
      </template> -->
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
      <EdomsCharts class="charts" :option="option"></EdomsCharts>
    </div>
    <div class="table-box">
      <record-table
        :title="'运行时间'"
        :long-width="'214px'"
        :is-light="false"
        :text-cols="textCols"
        :table-cols="amCols"
        :table-data="amTableData"
      ></record-table>
      <record-table
        :hide-col="true"
        :text-cols="[]"
        :is-light="false"
        :table-cols="pmCols"
        :table-data="amTableData"
      ></record-table>
    </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { dateRange, formatCurrentDateRange } from '@edoms/utils';

import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
// import { formatPrecision } from '@edoms/utils';
import useIntervalAsync from '../../useIntervalAsync';

import RecordTable from './components/RecordTable.vue';
// import useIntervalAsync from '../../useIntervalAsync';
import apiFactory from './api';
import { ControlModeList } from './type';

const props = defineProps<{
  config: ControlModeList;
}>();

const { request } = useApp(props);

const { fetchCurveData } = apiFactory(request);

import useI18n from '../../useI18n';

const { t } = useI18n();
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const textCols = ref(['优化策略用电量(kWh)', '未优化前用电量(kWh)']);
const amCols: any = ref([]);
const pmCols: any = ref([]);
const amTableData: any = ref();
const activeTab = ref(0);
const tabs = ref(['用电量对比', '电费对比']);

const changeTab = (index: number) => {
  if (activeTab.value === index) return;
  activeTab.value = index;
};

const tableHead: any = [
  {
    name: '00:00',
    prop: '00:00',
  },
  {
    name: '01:00',
    prop: '01:00',
  },
  {
    name: '02:00',
    prop: '02:00',
  },
  {
    name: '03:00',
    prop: '03:00',
  },
  {
    name: '04:00',
    prop: '04:00',
  },
  {
    name: '05:00',
    prop: '05:00',
  },
  {
    name: '06:00',
    prop: '06:00',
  },
  {
    name: '07:00',
    prop: '07:00',
  },
  {
    name: '08:00',
    prop: '08:00',
  },
  {
    name: '09:00',
    prop: '09:00',
  },
  {
    name: '10:00',
    prop: '10:00',
  },
  {
    name: '11:00',
    prop: '11:00',
  },
  {
    name: '12:00',
    prop: '12:00',
  },
  {
    name: '13:00',
    prop: '13:00',
  },
  {
    name: '14:00',
    prop: '14:00',
  },
  {
    name: '15:00',
    prop: '15:00',
  },
  {
    name: '16:00',
    prop: '16:00',
  },
  {
    name: '17:00',
    prop: '17:00',
  },
  {
    name: '18:00',
    prop: '18:00',
  },
  {
    name: '19:00',
    prop: '19:00',
  },
  {
    name: '20:00',
    prop: '20:00',
  },
  {
    name: '21:00',
    prop: '21:00',
  },
  {
    name: '22:00',
    prop: '22:00',
  },
  {
    name: '23:00',
    prop: '23:00',
  },
];

const tableList: any = [
  {
    '00:00': 191.16,
    '01:00': 358.8,
    '02:00': 358.74,
    '03:00': 375.72,
    '04:00': 358.83,
    '05:00': 376.47,
    '06:00': 165.54,
    '07:00': 0.12,
    '08:00': 0.215,
    '09:00': 0.774,
    '10:00': 0.172,
    '11:00': 0.48,
    '12:00': 2.16,
    '13:00': 0.6,
    '14:00': 0.043,
    '15:00': '-',
    '16:00': '-',
    '17:00': '-',
    '18:00': '-',
    '19:00': '-',
    '20:00': '-',
    '21:00': '-',
    '22:00': '-',
    '23:00': '-',
  },
  {
    '00:00': 53.35,
    '01:00': 49.96,
    '02:00': 44.84,
    '03:00': 47.56,
    '04:00': 42.76,
    '05:00': 42.44,
    '06:00': 43.53,
    '07:00': 49.85,
    '08:00': 143.21,
    '09:00': 150.65,
    '10:00': 163.04,
    '11:00': 618.19,
    '12:00': 764.96,
    '13:00': 789.96,
    '14:00': 312.13,
    '15:00': 386.93,
    '16:00': 406.05,
    '17:00': 1132.22,
    '18:00': 943.43,
    '19:00': 616.79,
    '20:00': 567.58,
    '21:00': 515.26,
    '22:00': 123.84,
    '23:00': 85.37,
  },
];

amTableData.value = tableList;

const initCols = (time: (string | number)[]) => {
  amCols.value = time.splice(0, 11);
  pmCols.value = time.splice(0, 13);
};
const option = ref<ECOption>({});

// const isCurve = ref<boolean>(false);

const lineUnit = ref<string[]>([]);

// const activeIndicatorConfig: any = computed<any[]>(() => props.config.indicators);

const updateParameterData = async () => {
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  const arr: any = [];
  Object.keys(tableList[0]).forEach((key: string) => {
    arr.push([key, tableList[0][key]]);
  });

  // const ydata = arr;
  // console.log(arr);
  // console.log(activeIndicatorConfig.value.indicators);
  const result: any = await fetchCurveData({
    startTime: start,
    endTime: end,
    tsUnit: 'H',
    ts: '1',
    dataCodes: ['PGY02014_SCD01001_STCDZ01001_U00000000_EQCD01CDQ01003_MP0000000'],
    // dataList: Array.from(activeIndicatorConfig.value.values()).map(({ instance, property }) => ({
    //   deviceCode: instance[instance.length - 1],
    //   propCode: property,
    // })),
  });
  console.log(result);

  const chartSeries: any = [];
  chartSeries.push({
    name: '优化策略用电量',
    type: 'line',
    showSymbol: false,
    smooth: false,
    color: '#0f0',
    data: [['00:00', 2]],
  });
  // chartSeries = result.map(({ insCode, propCode, dataList }, index) => {
  //   const activeIndicator = activeIndicatorConfig.value.get(`${insCode}:${propCode}`);
  //   const name = activeIndicator?.label;
  //   lineUnit.value.push(activeIndicator?.unit ?? '');
  //   return {
  //     name: name ? name : `未命名${index}`,
  //     type: 'line',
  //     showSymbol: false,
  //     smooth: isCurve.value,
  //     color: activeIndicator?.color,
  //     data: dataList.map(({ time, value }) => [
  //       stringToDate(time),
  //       formatPrecision(+value, activeIndicator?.precision ?? ''),
  //     ]),
  //   };
  // });
  option.value = generateOption(chartSeries);
  console.log(option.value);
};

function generateOption(series: any[] = []): ECOption {
  const legends = series.map(({ name }) => name);
  return {
    legend: {
      data: legends,
      textStyle: {
        color: '#ffffff85',
      },
    },
    tooltip: {
      trigger: 'axis',
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
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
      maxInterval: 3600 * 1000,
      splitLine: {
        show: false,
      },
      interval: 2,
      axisLabel: {
        formatter: '{HH}:{mm}',
        interval: 2,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
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
}

useIntervalAsync(updateParameterData, intervalDelay.value);

onMounted(() => {
  initCols(tableHead);
});
</script>

<style lang="scss" scoped>
.wrap-control {
  // min-width: 400px;
  // min-height: 20px;
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
    .record-table-container {
      margin-bottom: 20px;
    }
  }
}
</style>
