<template>
  <div class="eq-condition">
    <div class="eq-title">{{ condition.label }}</div>
    <div class="eq-indicators">
      <div v-for="({ label, displayParameter, unit }, index) in realTimeIndicators" :key="index" class="eq-indicator">
        <!-- <LongText class="label" :content="label" :content-style="indicatorTitleStyle"></LongText> -->
        <span class="lab-sty">{{ label }}</span>
        <div :style="indicatorValueStyle">
          <LongText class="value" :content="displayParameter" :content-style="indicatorValueStyle"></LongText>
          <span>{{ unit }}</span>
        </div>
      </div>
    </div>
    <div class="eq-indicator-tabs">
      <button
        v-for="(indicator, index) in indicators"
        :key="index"
        :class="indicator.label === activeTabIndicator ? ['eq-indicator-tab-active'] : []"
        @click="handleIndicatorTabChange(indicator)"
      >
        {{ indicator.label }}
        <!-- <LongText :content="indicator.label" :content-style="{ fontSize: '14px' }"></LongText> -->
      </button>
      <ElSelect
        v-if="otherIndicators.length"
        v-model="activeOtherIndicator"
        class="eq-indicator-tabs-more"
        placeholder="其他参数"
        @change="handleOtherIndicatorChange"
      >
        <ElOption
          v-for="(indicator, index) in otherIndicators"
          :key="index"
          :label="indicator.label"
          :value="indicator.label"
        ></ElOption>
      </ElSelect>
    </div>
    <EdomsCharts class="eq-indicator-chart" :option="chartsOption"></EdomsCharts>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { ElOption, ElSelect } from '@edoms/design';
import {
  dateRange,
  EdomsRequestFunc,
  formatCurrentDateRange,
  formatDate,
  formatPrecision,
  stringToDate,
} from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import LongText from '../../../LongText.vue';
import { ECOption } from '../../../types';
import useIntervalAsync from '../../../useIntervalAsync';
import apiFactory from '../api';
import { MConditionItemConfig, MIndicatorItemConfig } from '../type';

export interface Indicator {
  parameter: string;
  displayParameter: string;
  parameterStyle: {};
  label: string;
  deviceCode: string;
  propCode: string;
  unit: string;
  precision: string;
}

const props = defineProps<{
  condition: MConditionItemConfig;
  intervalDelay: number;
  request?: EdomsRequestFunc;
}>();

const { fetchHistoryData, fetchRealData } = apiFactory(props.request);

const indicators = ref<MIndicatorItemConfig[]>([]);

const otherIndicators = ref<MIndicatorItemConfig[]>([]);

const activeTabIndicator = ref<string>('');

const activeOtherIndicator = ref<string>('');

const realTimeIndicators = ref<Indicator[]>([]);

const activeIndicator = ref<Indicator>();

const chartsOption = ref<ECOption>({});

const indicatorValueStyle = computed<Record<string, any> | undefined>(() =>
  props.condition.color
    ? { display: 'flex', color: props.condition.color, fontSize: '14px', textAlign: 'center', width: '50%' }
    : { display: 'flex', fontSize: '14px', textAlign: 'center', width: '50%' }
);

watch(
  () => props.condition.indicators,
  (value) => {
    realTimeIndicators.value = value.map((indicator) => getIndicator(indicator));
    console.log(realTimeIndicators.value);
    indicators.value = value.slice(0, 5);
    otherIndicators.value = value.slice(5);

    if (indicators.value.length > 0) {
      activeTabIndicator.value = indicators.value?.[0].label;
      activeIndicator.value = getIndicator(indicators.value[0]);
    }
  },
  {
    immediate: true,
  }
);

const updateIndicatorsData = () => {
  if (!activeIndicator.value?.deviceCode || !activeIndicator.value?.propCode) {
    return;
  }
  const dataCodes: string[] = indicators.value.map(({ property }): string => property);

  if (dataCodes.length === 0) {
    return;
  }
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: [
      {
        deviceCode: activeIndicator.value?.deviceCode ?? '',
        propCode: activeIndicator.value?.propCode ?? '',
      },
    ],
  }).then((historyResult) => {
    const chartSeries = historyResult?.map(({ dataList }, index) => ({
      name: activeIndicator.value?.label ? activeIndicator.value.label : `未命名${index}`,
      type: 'line',
      showSymbol: false,
      data: dataList.map(({ time, value }) => [stringToDate(time), value]),
      itemStyle: {
        color: props.condition.lineColor,
      },
    }));
    chartsOption.value = generateOption(chartSeries ?? []);
  });

  fetchRealData({ dataCodes }).then((realTimeResult) => {
    realTimeResult.forEach((result) => {
      for (const realTimeIndicator of realTimeIndicators.value) {
        if (realTimeIndicator.propCode === result.propCode) {
          realTimeIndicator.parameter = `${result.propVal}`;
          realTimeIndicator.displayParameter = `${String(
            formatPrecision(result.propVal, realTimeIndicator.precision)
          )}`;
        }
      }
    });
    console.log(realTimeIndicators);
  });
};

const { flush } = useIntervalAsync(updateIndicatorsData, props.intervalDelay);

watch(
  () => activeIndicator.value,
  () => flush()
);

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
        let relVal = '';
        for (let i = 0, l = params.length; i < l; i++) {
          const time = formatDate(params[0].value[0], 'HH:mm:ss');
          const value = formatPrecision(params[0].value[1], activeIndicator.value?.precision ?? '');
          relVal +=
            '<br/>' +
            params[i].marker +
            params[i].seriesName +
            '  ' +
            time +
            '  ' +
            value +
            activeIndicator.value?.unit;
        }
        return relVal;
      },
    },
    grid: {
      left: '8%',
      right: '1%',
      top: 30,
      bottom: 20,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
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

const handleIndicatorTabChange = (indicatorConfig: MIndicatorItemConfig) => {
  activeTabIndicator.value = indicatorConfig.label;
  activeOtherIndicator.value = '';
  activeIndicator.value = getIndicator(indicatorConfig);
};

const handleOtherIndicatorChange = (value: string) => {
  if (value) {
    activeTabIndicator.value = '';
  }
  const indicatorConfig = props.condition.indicators.find(({ label }) => label === value);
  if (indicatorConfig) {
    activeIndicator.value = getIndicator(indicatorConfig);
  }
};

function getIndicator(indicatorConfig: MIndicatorItemConfig): Indicator {
  return {
    label: indicatorConfig.label,
    deviceCode: indicatorConfig.instance[indicatorConfig.instance.length - 1],
    propCode: indicatorConfig.property,
    parameter: '',
    displayParameter: '',
    unit: indicatorConfig.unit,
    parameterStyle: '',
    precision: indicatorConfig.precision,
  };
}
</script>

<style lang="scss">
:root {
  --el-bg-color-overlay: #1f1f1f;
  --el-fill-color-light: #505152;
  --el-color-primary: #ffffff;
}
</style>

<style lang="scss" scoped>
$borderColor: #212b3b;

$eqBg: #272727;
$eqTitleColor: #ffffff;
$eqIndicatorColor: #999999;

:deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-color: #212b3b;
  --el-input-text-color: #ffffff;
}

:deep(.el-select) {
  margin: auto;
  background-color: transparent;
  --el-select-input-focus-border-color: #ffffff;
}

:deep(.select-trigger) {
  width: 90%;
}

.eq-condition {
  width: 855px;
  height: 340px;
  background: rgba(9, 15, 23, 0.3);
  border: 1px solid #212c3c;
  display: grid;
  grid-template-rows: 62px 1fr;
  grid-template-columns: 240px 1fr;
  box-sizing: border-box;
}

.eq-title {
  color: $eqTitleColor;
  height: 62px;
  border-bottom: 1px solid #1d2634;
  font-size: 14px;
  line-height: 62px;
  padding-left: 20px;
  box-sizing: border-box;
}

.eq-indicators {
  grid-column: 1 / span 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.eq-indicator {
  display: flex;
  border: 1px solid $borderColor;
  background: rgba(20, 27, 37, 0.4);
  margin-bottom: 10px;
  line-height: 30px;

  .lab-sty {
    width: 50%;
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #eaf5ff;
    border-right: 1px solid $borderColor;
  }

  .label {
    border-right: 1px solid $borderColor;
  }

  .value {
    flex-grow: 1;
  }
}

.eq-indicator-tabs {
  height: 62px;
  border-bottom: 1px solid #1d2634;
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  box-sizing: border-box;

  &-more {
    width: 100%;
    background-color: transparent;
  }

  button {
    background-color: transparent;
    color: $eqIndicatorColor;
    border: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &::after {
      content: '';
      margin-top: 2px;
      height: 2px;
    }
  }
}

.eq-indicator-tab-active {
  color: #ffffff !important;

  &::after {
    content: '';
    display: inline-block;
    width: 36px;
    height: 2px;
    background: #00a3ff;
    border-radius: 1px;
  }
}

.eq-indicator-chart {
  grid-row: 2;
  grid-column: 2;
}
</style>
