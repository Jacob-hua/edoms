<template>
  <div v-show="indicatorsVisable" style="min-width: 365px; min-height: 160px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="365" min-height="160">
      <template #operation>
        <div class="operation" @click="handleShowMore">
          <img :style="'transform: rotateZ(90deg)'" src="../../../assets/image/arrow_up.png" alt="" />
        </div>
      </template>
      <div class="wrap-body">
        <div class="left">
          <div class="top">
            <ActualCard :config="config" :actual-value="actualValue"></ActualCard>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <LinearCard :config="config" :actual-value="actualValue"></LinearCard>
          </div>
          <div class="bottom">
            <ColorLegend :config="config"></ColorLegend>
          </div>
        </div>
      </div>
    </BusinessCard>
    <EChartsDialog
      v-if="chartDialogVisible"
      v-model:visible="chartDialogVisible"
      title="能效监测"
      :width="1360"
      :height="570"
      :options="chartOptionsData"
      @type-change="handleChangeDateType"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatDate, formatDateRange, UnitTime } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import ActualCard from './component/ActualCard.vue';
import ColorLegend from './component/ColorLegend.vue';
import EChartsDialog from './component/EChartsDialog.vue';
import LinearCard from './component/LinearCard.vue';
import apiFactory from './api';
import locales from './locales';
import { ExecuteChartsParams, MEnergyMonitoring } from './type';

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const { request, setMessage, provideMethod } = useApp(props);

const { fetchExecuteApi } = apiFactory(request);

setMessage(locales);

//COP属性
const property = computed(() => props.config.property);

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const indicatorsVisable = ref(false);

provideMethod('changeIndicatorsVisable', (visable: boolean) => {
  indicatorsVisable.value = visable;
});

//能效监测cop
const actualValue = ref<number>(0);

const getEfficiencyData = async () => {
  if (!property.value || property.value.length <= 0) return;

  const time = formatDate(new Date(), 'YYYY-MM-DD');
  const result = await fetchExecuteApi({
    apiCode: 'queryEnergyEfficiencyMonitoring',
    requestParam: {
      codes: property.value,
      time,
    },
  });
  if (!result) return;
  actualValue.value = result[property.value] ?? '-';
};

//能效监测曲线
const chartDialogVisible = ref<boolean>(false);

const xAxisData = ref();

const chartSeries = ref<any[]>([]);

const interval = ref<number>(0);

const dateType = ref<UnitTime>('day');

const handleShowMore = () => {
  getHistoryData(new Date(), 'day');
  chartDialogVisible.value = true;
};

const handleChangeDateType = (type: UnitTime) => {
  dateType.value = type;
  getHistoryData(new Date(), type);
};

//获取曲线
const chartOptionsData = ref();

const dateTypeCode = new Map([
  ['day', 'queryEnergyEfficiencyMonitoringGraphOfDay'],
  ['month', 'queryEnergyEfficiencyMonitoringGraphOfMonthOrYear'],
  ['year', 'queryEnergyEfficiencyMonitoringGraphOfMonthOrYear'],
]);

const getHistoryData = async (date: Date, type: UnitTime = 'day') => {
  const requestParam: ExecuteChartsParams = { codes: property.value };
  if (type === 'day') {
    interval.value = 3;
    const { start, end } = formatDateRange(date, type, 'YYYY-MM-DD HH:mm:ss');
    Object.assign(requestParam, {
      startTime: start,
      endTime: end,
      ts: 15,
      tsUnit: 'MIN',
    });
  } else {
    interval.value = 0;
    const time = formatDate(new Date(), type === 'month' ? 'YYYY-MM' : 'YYYY');
    Object.assign(requestParam, { time });
  }
  chartSeries.value = [];
  const result = await fetchExecuteApi({
    apiCode: dateTypeCode.get(type) as string,
    requestParam,
  });
  if (!result || Object.keys(result).length <= 0) return;
  xAxisData.value = result.xList;
  chartSeries.value = result[property.value];
  chartOptionsData.value = formatChartData();
};

const formatChartData = () => {
  return {
    toolbox: {
      show: true,
      showTitle: false,
      right: '10%',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11,34,52,0.9)',
      borderWidth: 1,
      borderColor: 'rgb(73, 73, 73)',
      textStyle: '#fff',
      formatter: function (params: Array<Record<string, any>>) {
        if (!params || params.length <= 0) return;
        return `<span style="color:#fff"><span style="margin-right:6px">${formatDate(new Date(), 'YYYY-MM-DD')}</span>${
          params[0].axisValueLabel
        }</span><br /><div style="display: inline-block;width:10px;height:10px;background-color:#2AF830;border-radius: 50%;margin-right:10px;"></div><span style="color:#2AF830">${
          params[0].data[1]
        }</span>`;
      },
    },
    grid: {
      containLabel: true,
    },
    legend: {
      data: ['COP'],
      top: 10,
      textStyle: {
        color: '#EAF5FF',
      },
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: interval.value,
      },
      data: xAxisData.value,
    },
    yAxis: {
      type: 'value',
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
    series: [
      {
        type: 'bar',
        data: chartSeries.value,
        itemStyle: {
          color: '#2AF830',
        },
      },
    ],
  };
};

watch(
  () => props.config.property,
  () => {
    chartOptionsData.value = formatChartData();
  },
  { immediate: true }
);

useIntervalAsync(getEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-body {
  width: 100%;
  // min-height: 160px;
  display: flex;

  .left {
    height: calc(100% - 100px);
    min-width: 60px;
    width: 18%;
    margin-left: 15px;
    margin-top: 25px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .top {
      width: 100%;
      height: 49.5%;
    }

    .line {
      width: calc(100% - 21px);
      height: 1px;
      background: rgba($color: #00a3ff, $alpha: 0.2);
    }

    .bottom {
      width: 100%;
      height: 49.5%;
    }
  }

  .right {
    margin: 0px 20px 20px;
    flex-grow: 1;
    height: calc(100% - 53px);
    display: flex;
    flex-direction: column;

    .top {
      width: 100%;
      flex: 2;
    }

    .line {
      width: 100%;
      height: 1px;
      background: rgba($color: #00a3ff, $alpha: 0.2);
    }

    .bottom {
      width: 100%;
      flex: 1;
      margin-top: 28px;
    }
  }
}

.operation {
  font-size: 22px;
  cursor: pointer;
  color: #ffffff85;
}
</style>
