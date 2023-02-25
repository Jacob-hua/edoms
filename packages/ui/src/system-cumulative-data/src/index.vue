<template>
  <div class="system-cumulative-data">
    <BusinessCard title="系统累计数据" subtitle="SYSTEM CUMULATIVE DATA" :min-width="392" :min-height="240">
      <template #operation>
        <div class="type-select">
          <span class="type-box" :class="active === 'day' ? 'checked' : ''" @click="handleChangeType('day')">日</span>
          <span class="type-box" :class="active === 'month' ? 'checked' : ''" @click="handleChangeType('month')"
            >月</span
          >
          <span class="type-box" :class="active === 'year' ? 'checked' : ''" @click="handleChangeType('year')">年</span>
        </div>
      </template>
      <div class="wrapper">
        <div v-for="(item, index) in currentData" :key="index" class="data-item" @click="handleClickItem(item)">
          <div class="col-text label">
            <span :title="item.label">{{ item.label }}</span>
          </div>
          <div class="col-text cumulative-value">
            <span class="data-value" :title="item.dataValue">{{ item.dataValue }}</span>
            <span class="data-unit">{{ item.unit }}</span>
          </div>
          <div class="col-text trend-box">
            <div
              v-if="item.calculateType === 'MOM' || item.calculateType === 'ALL'"
              class="mom-trend trend"
              :style="{ width: item.calculateType === 'ALL' ? '50%' : '100%' }"
            >
              <span>{{ typeName }}环比</span>
              <span v-if="item.momTrend === 'flat'" class="flat-span">--</span>
              <span v-else>
                <img :src="item.momTrend === 'up' ? Up : Down" alt="" />
              </span>
              <span class="ratio-span" :class="item.momTrend" :title="`${item.momRatio}%`">{{ item.momRatio }}%</span>
            </div>
            <div
              v-if="item.calculateType === 'YOY' || item.calculateType === 'ALL'"
              class="yoy-trend trend"
              :style="{ width: item.calculateType === 'ALL' ? '50%' : '100%' }"
            >
              <span>{{ typeName }}同比</span>
              <span v-if="item.yoyTrend === 'flat'" class="flat-span">--</span>
              <span v-else>
                <img :src="item.yoyTrend === 'up' ? Up : Down" alt="" />
              </span>
              <span class="ratio-span" :class="item.yoyTrend" :title="`${item.yoyRatio}%`">{{ item.yoyRatio }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="paginator">
        <ElPagination
          layout="prev, pager, next"
          :total="systemCumulativeData.length"
          :cur-page="currentPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></ElPagination>
      </div>
    </BusinessCard>
    <EChartsDialog
      v-model:visible="dialogVisible"
      :options="option"
      :title="chartTitle"
      :width="960"
      :height="480"
      :date-range="chartsParam.dateRange"
      @type-change="handleChangeDateType"
    >
    </EChartsDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { ElPagination } from '@edoms/design';
import { dateRange, formatPrecision, stringToDate } from '@edoms/utils';
import { UnitTime } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import Down from './assets/downTrend.png';
import Up from './assets/upTrend.png';
import EChartsDialog from './component/EChartsDialog.vue';
import apiFactory from './api';
import { Category, FetchCumulativeDataReq, MCumulativeConfig } from './type';

interface CumulativeList extends Category {
  dataValue: string;
  momRatio: string;
  momTrend: 'up' | 'down' | 'flat';
  yoyRatio: string;
  yoyTrend: 'up' | 'down' | 'flat';
}
const props = defineProps<{
  config: MCumulativeConfig;
}>();

const { request } = useApp(props);

const { fetchCumulativeData, fetchHistoryData } = apiFactory(request);

const currentPage = ref(1);
const pageSize = ref(4);

const systemCumulativeData = ref<CumulativeList[]>([]);

const active = ref('day');

const dialogVisible = ref(false);

const option = ref<ECOption>({});

const chartTitle = ref<string>('');

const chartUnit = ref<string>('');
const chartPrecision = ref<string>('');

const chartsParam = ref({
  dateRange: 'day',
  variables: {},
  expression: '',
  insCode: '',
  propCode: '',
  type: '',
});

const xAxisMin = computed(() => dateRange(new Date(), chartsParam.value.dateRange as UnitTime).start);
const xAxisMax = computed(() => dateRange(new Date(), chartsParam.value.dateRange as UnitTime).end);

const axisLabelFormatter = computed(() => {
  if (chartsParam.value.dateRange === 'day') {
    return '{HH}:{mm}';
  }
  if (chartsParam.value.dateRange === 'month') {
    return '{dd}';
  }
  if (chartsParam.value.dateRange === 'year') {
    return '{MM}';
  }
  return '{HH}:{mm}';
});

const categories = computed(() => props.config.category ?? []);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const currentData = computed<CumulativeList[]>(() => {
  return systemCumulativeData.value.slice(4 * (currentPage.value - 1), 4 * currentPage.value);
});

const typeName = computed(() => {
  const obj: any = {
    day: '日',
    month: '月',
    year: '年',
  };
  return obj[active.value];
});

const getSystemCumulativeData = async () => {
  if (!categories.value || categories.value.length <= 0) return;
  const params: FetchCumulativeDataReq = categories.value.map((item, index) => {
    const variables: Record<string, any> = {};
    item.variables.forEach(({ variable, instance, instanceType, property }) => {
      const insCode = instance[instance.length - 1];
      variables[variable] = `${insCode}:${instanceType}:${property}`;
    });
    return {
      dateRange: active.value,
      calculateType: item.calculateType,
      identify: index.toString(),
      expression: item.expression,
      insCode: item.instance[item.instance.length - 1],
      propCode: item.property,
      type: item.instanceType,
      variables: variables,
    };
  });
  const result = await fetchCumulativeData(params);
  if (!result || result.length <= 0) return;
  result.forEach(({ identify, dataValue, momRatio, momTrend, yoyRatio, yoyTrend }) => {
    const targetResult = systemCumulativeData.value[Number(identify)];
    targetResult.dataValue = String(formatPrecision(Number(dataValue), targetResult.precision));
    targetResult.momRatio = String(formatPrecision(Number(momRatio), targetResult.ratioPrecision));
    targetResult.momTrend = momTrend;
    targetResult.yoyRatio = String(formatPrecision(Number(yoyRatio), targetResult.ratioPrecision));
    targetResult.yoyTrend = yoyTrend;
  });
};

const fetchHistory = async () => {
  const result = await fetchHistoryData(chartsParam.value);
  const chartSeries = [
    {
      name: chartTitle.value ? chartTitle.value : `未命名`,
      type: 'bar',
      showSymbol: false,
      data: result.map(({ time, value }) => [stringToDate(time), formatPrecision(Number(value), chartPrecision.value)]),
    },
  ];

  option.value = generateOption(chartSeries);
};

const handleChangeType = (type: string) => {
  active.value = type;
  chartsParam.value.dateRange = type;
};

const handleClickItem = (item: CumulativeList) => {
  dialogVisible.value = true;
  chartTitle.value = item.label;
  chartUnit.value = item.unit;
  chartPrecision.value = item.precision;
  const variables: Record<string, any> = {};
  item.variables?.forEach(({ variable, instance, instanceType, property }) => {
    const insCode = instance[instance.length - 1];
    variables[variable] = `${insCode}:${instanceType}:${property}`;
  });
  chartsParam.value.expression = item.expression;
  chartsParam.value.insCode = item.instance[item.instance.length - 1];
  chartsParam.value.propCode = item.property;
  chartsParam.value.type = item.instanceType;
  chartsParam.value.variables = variables;
  fetchHistory();
};

const handleSizeChange = (value: string) => {
  currentPage.value = Number(value);
};

const handleCurrentChange = (value: string) => {
  currentPage.value = Number(value);
};

const handleChangeDateType = (type: string) => {
  chartsParam.value.dateRange = type;
  fetchHistory();
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
      valueFormatter: (value) => `${value}${chartUnit.value}`,
    },
    grid: {
      right: '1%',
      top: 30,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: xAxisMin.value,
      max: xAxisMax.value,
      maxInterval: 3600 * 1000,
      splitLine: {
        show: false,
      },
      axisLabel: {
        formatter: axisLabelFormatter.value,
      },
    },
    yAxis: {
      name: `单位：${chartUnit.value}`,
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

useIntervalAsync(getSystemCumulativeData, intervalDelay.value);

watch(
  () => active.value,
  () => getSystemCumulativeData()
);

watch(
  () => categories.value,
  (categories) => {
    systemCumulativeData.value = categories.map((item) => ({
      label: item.label,
      instanceType: item.instanceType,
      instance: item.instance,
      propertyType: item.propertyType,
      property: item.property,
      precision: item.precision,
      ratioPrecision: item.ratioPrecision,
      unit: item.unit,
      variables: item.variables,
      calculateType: item.calculateType,
      expression: item.expression,
      dataValue: '--',
      momRatio: '--',
      momTrend: 'flat',
      yoyRatio: '--',
      yoyTrend: 'flat',
    }));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.system-cumulative-data {
  display: flex;

  .wrapper {
    width: 100%;
    color: rgba(255, 255, 255, 0.3960784314);
    padding: 20px 16px 0 16px;
    box-sizing: border-box;

    .data-item {
      display: flex;
      height: 36px;
      background: #3a3a3a;
      padding: 0 16px 0 20px;
      cursor: pointer;
      margin-bottom: 4px;
      box-sizing: border-box;

      .col-text {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .trend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          span {
            padding-right: 4px;
          }

          .flat-span {
            display: inline-block;
          }

          .ratio-span {
            width: 100%;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
        }

        .up {
          color: #d22129;
        }

        .down {
          color: #49aa19;
        }

        .flat {
          color: #ffffff45;
        }
      }

      .trend-box {
        justify-content: center;
        flex-grow: 2;
        width: 50%;
      }

      .label {
        width: 20%;

        span {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .cumulative-value {
        padding: 0 8px;
        width: 30%;
      }

      .data-value {
        font-size: 16px;
        color: #00ff00;
        font-weight: bold;
        padding-right: 4px;
        width: 60%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .data-item::before {
      content: '';
      width: 4px;
      height: 36px;
      background-color: #b3b3b3;
      position: absolute;
      left: 16px;
    }
  }

  .paginator {
    position: absolute;
    bottom: 0px;
    right: 16px;
  }

  :deep(.el-pagination) {
    background-color: transparent !important;

    .btn-prev {
      color: #fff;
      background-color: transparent !important;
    }

    .btn-next {
      color: #fff;
      background-color: transparent !important;
    }

    .el-pager {
      .number {
        color: #fff;
      }

      .is-active {
        color: #007acc;
      }

      li {
        background-color: transparent !important;
      }
    }
  }

  .type-select {
    .type-box {
      background-color: #2a2a2a;
      cursor: pointer;
      color: #ffffff45;
      margin-left: 8px;
    }

    .checked {
      color: #e99a3c;
    }
  }
}
:deep(.business-wrapper-body) {
  align-items: flex-start;
}
</style>
