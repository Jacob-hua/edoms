<template>
  <div class="wrapper">
    <div class="wrapper-tab">
      <!-- <div class="calendar">日历插件</div> -->
      <TimeCalendar :option="timeType" class="calendar" @change-time="handleSelectTime"></TimeCalendar>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTimeRange">
        <el-tab-pane :label="t('今日统计')" name="D"> </el-tab-pane>
        <el-tab-pane :label="t('月度统计')" name="M"> </el-tab-pane>
        <!-- <el-tab-pane :label="t('年度统计')" name="year"> </el-tab-pane> -->
      </el-tabs>
      <Statistics key="underVoltage" :title="t('电压波动')" :option="underVoltageOption"></Statistics>
      <Statistics key="overVoltage" :title="t('过电压')" :option="overVoltageOption"></Statistics>
      <Statistics key="underVoltage" :title="t('欠电压')" :option="underVoltageOption"></Statistics>
    </div>

    <div class="wrapper-con">
      <div class="wrapper-con-right">
        <div class="wrapper-tie">
          <span>{{ t('描述') }}</span>
        </div>
        <div class="wrapper-icon">
          <img class="icon" src="../../assets/dian.png" alt="" />
          <span class="elefont">{{ t('电压波动分析') }}</span>
        </div>
        <EdomsCharts class="charts" :option="histogramOptions"></EdomsCharts>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { formatDate } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import useApp from '../../../useApp';
import useI18n from '../../../useI18n';
import useIntervalAsync from '../../../useIntervalAsync';
import apiFactory from '../api';
import { ElectricEnergyQuality } from '../type';

import Statistics from './Statistics.vue';
import TimeCalendar from './TimeCalendar.vue';
const { t } = useI18n();

type Itages = Array<number>;

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();
const { request } = useApp(props);
const { fetchExecuteApi } = apiFactory(request);

const activeName = ref('D');

const timeType = ref<string>('date');
//欠电压
const underVoltageOption = ref<Itages>([]);
//过电压
const overVoltageOption = ref<Itages>([]);
//电压波动
const voltageFluctuationOption = ref<Itages>([]);
//电压波动分析图表
const histogramOptions = ref<ECOption>({});

const instanceCode = computed(() => {
  const voltageAnalysis = props.config.voltageAnalysis[0]?.instance;
  return voltageAnalysis ? voltageAnalysis[voltageAnalysis.length - 1] : '';
});

const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const getVoltagAnalysisData = async (time: string = formatDate(new Date(), 'YYYY-MM-DD')) => {
  if (!props.config || instanceCode.value?.length <= 0) return;
  const params = { devCode: instanceCode.value, time, queryType: activeName.value };
  const result = await fetchExecuteApi({ apiCode: 'queryVoltageAnalysis', requestParam: params });
  if (!result) return;
  const { histogram, underVoltage, overVoltage, voltageFluctuation } = result;
  underVoltageOption.value = underVoltage;
  overVoltageOption.value = overVoltage;
  voltageFluctuationOption.value = voltageFluctuation;
  histogramOptions.value = fomatChartData(histogram.seriesData, histogram.xaxisData) as ECOption;
};

const fomatChartData = (seriesData: Array<number>, xAxisData: Array<string>) => {
  return {
    grid: {
      left: 24,
      bottom: 42,
      right: 20,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#1A242B',
          width: 1,
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      {
        data: seriesData,
        label: {
          color: '#EAF5FF',
          show: true,
          position: 'top',
        },
        type: 'bar',
        barWidth: 30,
        barGap: 70,
      },
    ],
  };
};

const handleSelectTime = (time: string) => {
  getVoltagAnalysisData(formatDate(time, 'YYYY-MM-DD'));
};

const handleChangeTimeRange = () => {
  getVoltagAnalysisData();
};

useIntervalAsync(getVoltagAnalysisData, intervalDelay.value);
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav) {
  line-height: 80px;
}

:deep(.el-tabs__header) {
  margin: 0px;
}

:deep(.el-tabs__nav-wrap::after) {
  content: none;
}

:deep(.el-tabs__active-bar) {
  background: #00a3ff;
}

:deep(.el-tabs__item) {
  color: #eaf5ff;
}

.wrapper {
  height: 688px;
  margin: 0px 30px 0px 30px;
  display: flex;

  .wrapper-tab {
    width: 782px;

    // height: 65px;
    .calendar {
      float: right;
      margin-right: 30px;
    }
  }

  .wrapper-con {
    height: 610px;
    margin-top: 75px;

    .wrapper-con-right {
      width: 958px;
      height: 610px;
      background: rgba(9, 15, 23, 0.3);
      border: 1px solid #212c3c;

      .wrapper-tie {
        width: 399px;
        height: 36px;
        box-sizing: border-box;
        border-radius: 2px;
        margin: 20px auto;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #c4e5f8;
        line-height: 36px;
        background: #030e16;
        text-align: center;
      }

      .wrapper-icon {
        height: 20px;
        line-height: 20px;
        color: #eaf5ff;
        font-size: 16px;
        margin-left: 24px;

        .icon {
          width: 18px;
          height: 18px;
        }

        .elefont {
          margin-left: 10px;
        }
      }

      .charts {
        width: 958px;
        height: 500px;
      }
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
}
</style>
