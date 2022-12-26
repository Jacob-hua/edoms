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
import { MIndicatorItemConfig, MRunningParameters } from './type';

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

const parameterConfigs = computed<MIndicatorItemConfig[]>(() => {
  const result = props.config[activeCategory.value];
  if (result) {
    return result;
  }
  return [];
});

const activeParameter = ref<number>(-1);

const activeParameterConfig = computed<MIndicatorItemConfig>(() => parameterConfigs.value[activeParameter.value]);

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

const parameterData = ref<any[]>([]);

const updateParameterData = async () => {
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: parameterConfigs.value.map(({ instance, property }) => ({
      deviceCode: instance[instance.length - 1],
      propCodeList: [property],
    })),
  });

  const historyData = result.find(
    (item) =>
      Object.keys(item).includes(activeParameterConfig.value.property) &&
      item[activeParameterConfig.value.property].some(
        ({ insCode }) =>
          insCode === activeParameterConfig.value.instance[activeParameterConfig.value.instance.length - 1]
      )
  );
  parameterData.value = (historyData?.[activeParameterConfig.value.property][0].dataList ?? []).map(
    ({ time, value }) => [stringToDate(time), value]
  );
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
  return generateOption(parameterData.value);
});

function generateOption(data: any[] = []): ECOption {
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
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data,
      },
    ],
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
