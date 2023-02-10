<template>
  <BusinessCard title="运行参数" min-width="1080" min-height="240">
    <template #operation>
      <el-tabs v-model="activeCategory">
        <el-tab-pane v-for="{ name, label } in categories" :key="name" :label="label" :name="name" />
      </el-tabs>
    </template>
    <SystemParameter
      v-if="activeCategory === 'systems'"
      :option="option"
      :parameter-configs="parameterConfigs"
      :width="908"
      :height="240"
      @change-system-config="handleChangeSystemConfig"
    >
    </SystemParameter>
    <EquipmentParameter
      v-if="activeCategory === 'equipments'"
      :option="option"
      :parameter-configs="parameterConfigs"
      :width="908"
      :height="240"
      @change-equipment-config="handleChangeEquipmentConfig"
    >
    </EquipmentParameter>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { ElTabPane, ElTabs } from '@edoms/design';
import { dateRange, formatCurrentDateRange, formatDate, stringToDate } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

// import EdomsCharts from '../../EdomsCharts.vue';
import EquipmentParameter from './component/EquipmentParameter.vue';
import SystemParameter from './component/SystemParameter.vue';
import apiFactory from './api';
import {
  MEquipmentIndicatorConfig,
  MEquipmentParameterConfig,
  MRunningParameters,
  MSystemIndicatorConfig,
} from './type';

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
const option = ref<ECOption>({});

const parameterConfigs = computed(() => {
  const result = props.config[activeCategory.value];
  if (result) {
    return result;
  }
  return [];
});

const activeIndicatorConfig = ref<Map<string, MSystemIndicatorConfig | MEquipmentIndicatorConfig>>(
  new Map<string, MSystemIndicatorConfig | MEquipmentIndicatorConfig>()
);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

const chartSeries = ref<any[]>([]);

const handleChangeSystemConfig = (conf: Map<string, MSystemIndicatorConfig>) => {
  activeIndicatorConfig.value = conf;
};

const handleChangeEquipmentConfig = (conf: Map<string, MEquipmentParameterConfig>) => {
  activeIndicatorConfig.value = conf;
};

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
  option.value = generateOption(chartSeries.value);
};

const { flush } = useIntervalAsync(updateParameterData, intervalDelay.value);

watch(
  () => activeIndicatorConfig.value,
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
    xAxis: {
      type: 'time',
      min: dateRange(new Date(), 'day').start,
      max: dateRange(new Date(), 'day').end,
      splitLine: {
        show: false,
      },
      minInterval: 3600 * 1000 * 2,
      maxInterval: 3600 * 1000 * 2,
      interval: 3600 * 1000 * 2,
      axisLabel: {
        formatter: function (value: any) {
          return formatDate(value, 'HH:mm');
        },
        interval: 1,
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
</script>

<style lang="scss" scoped>
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
