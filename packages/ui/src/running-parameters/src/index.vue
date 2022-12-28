<template>
  <BusinessCard title="运行参数" min-width="1080" min-height="240">
    <template #operation>
      <el-tabs v-model="activeCategory">
        <el-tab-pane v-for="{ name, label } in categories" :key="name" :label="label" :name="name" />
      </el-tabs>
    </template>
    <div class="wrapper">
      <el-tabs v-model="activeParameter" class="left-tabs" tab-position="left">
        <el-tab-pane v-for="({ label }, index) in parameterConfigs" :key="index" :label="label" :name="index" />
      </el-tabs>
      <EdomsCharts v-if="option" :width="908" :height="240" :option="option" />
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatCurrentDateRange, stringToDate } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import EdomsCharts from '../../EdomsCharts.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import { MIndicatorItemConfig, MParameterItemConfig, MRunningParameters } from './type';

const props = defineProps<{
  config: MRunningParameters;
}>();

const { request } = useApp(props);

const { fetchHistoryData } = apiFactory(request);

const categories = ref([
  {
    label: '系统曲线',
    name: 'systems',
  },
  {
    label: '设备曲线',
    name: 'equipments',
  },
]);

const activeCategory = ref<string>('systems');

const parameterConfigs = computed<MParameterItemConfig[]>(() => {
  const result = props.config[activeCategory.value];
  if (result) {
    return result;
  }
  return [];
});

const activeParameter = ref<number>(-1);

const activeIndicatorConfig = computed<Map<string, MIndicatorItemConfig>>(() => {
  const result = new Map<string, MIndicatorItemConfig>();
  if (!parameterConfigs.value[activeParameter.value]?.indicators) {
    return result;
  }
  parameterConfigs.value[activeParameter.value].indicators.forEach((config) =>
    result.set(`${config.instance[config.instance.length - 1]}:${config.property}`, config)
  );
  return result;
});

watch(
  () => parameterConfigs.value,
  () => (activeParameter.value = 0),
  { immediate: true }
);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

const chartSeries = ref<any[]>([]);

const updateParameterData = async () => {
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: Array.from(activeIndicatorConfig.value.values()).map(({ instance, property }) => ({
      deviceCode: instance[instance.length - 1],
      propCode: property,
    })),
  });

  chartSeries.value = result.map(({ insCode, propCode, dataList }) => ({
    name: activeIndicatorConfig.value.get(`${insCode}:${propCode}`)?.label,
    type: 'line',
    showSymbol: false,
    data: dataList.map(({ time, value }) => [stringToDate(time), value]),
  }));
};

const { flush } = useIntervalAsync(updateParameterData, intervalDelay.value);

watch(
  () => activeParameter.value,
  () => flush()
);

const option = computed<ECOption | undefined>(() => {
  if (parameterConfigs.value.length <= 0) {
    return undefined;
  }
  return generateOption(chartSeries.value);
});

function generateOption(series: any[] = []): ECOption {
  return {
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series,
  };
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}
:deep(.left-tabs) {
  & .el-tabs__item {
    width: 120px;
    text-align: center;
  }
  & .el-tabs__item.is-active {
    background-color: #333333;
  }
}
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__item) {
  color: #ffffff;
}
:deep(.el-tabs__item.is-active) {
  color: #e99a3c;
}
:deep(.el-tabs__active-bar) {
  background-color: #e99a3c;
}
:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}
</style>
