<template>
  <div class="eq-condition">
    <div class="eq-title">{{ condition.label }}</div>
    <div class="eq-indicators">
      <div v-for="({ label, displayParameter, unit }, index) in realTimeIndicators" :key="index" class="eq-indicator">
        <LongText class="label" :content="label" :content-style="indicatorTitleStyle"></LongText>
        <LongText class="value" :content="displayParameter" :content-style="indicatorValueStyle"></LongText>
        <span :style="indicatorValueStyle">{{ unit }}</span>
      </div>
    </div>
    <div class="eq-indicator-tabs">
      <button
        v-for="(indicator, index) in indicators"
        :key="index"
        :class="indicator.label === activeTabIndicator ? ['eq-indicator-tab-active'] : []"
        @click="handleIndicatorTabChange(indicator)"
      >
        <LongText :content="indicator.label" :content-style="{ fontSize: '14px' }"></LongText>
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
    <div class="eq-indicator-chart">
      <EdomsCharts :option="chartsOption" :width="685" :height="220"></EdomsCharts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { ElOption, ElSelect } from '@edoms/design';
import { dateRange, EdomsRequestFunc, formatCurrentDateRange, formatPrecision, stringToDate } from '@edoms/utils';

import EdomsCharts from '../../../EdomsCharts.vue';
import LongText from '../../../LongText.vue';
import { ECOption } from '../../../types';
import useIntervalAsync from '../../../useIntervalAsync';
import apiFactory from '../api';
import { MConditionItemConfig, MIndicatorItemConfig, ParameterItem } from '../type';

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

const { fetchHistoryData, fetchRealTimeData } = apiFactory(props.request);

const indicators = ref<MIndicatorItemConfig[]>([]);

const otherIndicators = ref<MIndicatorItemConfig[]>([]);

const activeTabIndicator = ref<string>('');

const activeOtherIndicator = ref<string>('');

const realTimeIndicators = ref<Indicator[]>([]);

const activeIndicator = ref<Indicator>();

const chartsOption = ref<ECOption>({});

const indicatorTitleStyle = computed<Record<string, any> | undefined>(() => ({
  fontSize: '14px',
  textAlign: 'center',
  width: '100px',
}));

const indicatorValueStyle = computed<Record<string, any> | undefined>(() =>
  props.condition.color
    ? { color: props.condition.color, fontSize: '8px', textAlign: 'center' }
    : { fontSize: '8px', textAlign: 'center' }
);

watch(
  () => props.condition.indicators,
  (value) => {
    realTimeIndicators.value = value.map((indicator) => getIndicator(indicator));
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

const updateIndicatorsData = async () => {
  if (!activeIndicator.value?.deviceCode || !activeIndicator.value?.propCode) {
    return;
  }
  const realTimeResult = await fetchRealTimeData({
    dataList: indicators.value.reduce(
      (dataList, { instance, property }) => [
        ...dataList,
        {
          deviceCode: instance[instance.length - 1],
          propCodeList: [property],
        },
      ],
      [] as ParameterItem[]
    ),
  });

  realTimeResult.forEach((result) => {
    for (const realTimeIndicator of realTimeIndicators.value) {
      if (realTimeIndicator.deviceCode === result.deviceCode && realTimeIndicator.propCode === result.propCode) {
        realTimeIndicator.parameter = `${result.dataValue}`;
        realTimeIndicator.displayParameter = `${String(
          formatPrecision(result.dataValue, realTimeIndicator.precision)
        )}`;
      }
    }
  });

  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  const historyResult = await fetchHistoryData({
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
  });
  const chartSeries = historyResult?.map(({ dataList }) => ({
    name: activeIndicator.value?.label,
    type: 'line',
    showSymbol: false,
    data: dataList.map(({ time, value }) => [stringToDate(time), value]),
    itemStyle: {
      color: props.condition.lineColor,
    },
  }));
  chartsOption.value = generateOption(chartSeries ?? []);
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
    },
    grid: {
      left: '8%',
      right: '1%',
      top: 30,
      bottom: 20,
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
$borderColor: #505152;

$eqBg: #272727;
$eqTitleColor: #ffffff;
$eqIndicatorColor: #999999;
:deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-color: #505152;
  --el-input-text-color: #ffffff;
}
:deep(.el-select) {
  background-color: transparent;
  --el-select-input-focus-border-color: #ffffff;
}
.eq-condition {
  width: 912px;
  height: 340px;
  background-color: $eqBg;
  border-radius: 3px;
  border: 1px solid $borderColor;
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-template-columns: 164px 1fr;
  padding: 30px 16px;
  row-gap: 4px;
  column-gap: 30px;
  box-sizing: border-box;
}
.eq-title {
  color: $eqTitleColor;
  font-size: 14px;
  line-height: 40px;
}
.eq-indicators {
  grid-column: 1 / span 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.eq-indicator {
  display: flex;
  border: 1px solid $borderColor;
  border-radius: 3px;
  color: $eqIndicatorColor;
  margin-top: 4px;
  line-height: 30px;
  .label {
    border-right: 1px solid $borderColor;
  }
  .value {
    flex-grow: 1;
  }
}
.eq-indicator-tabs {
  grid-column: 2;
  grid-row: 1;

  display: grid;
  grid-template-columns: repeat(6, 1fr);

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
    width: 60px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 1px;
  }
}
.eq-indicator-chart {
  grid-row: 2;
  grid-column: 2;
}
</style>
