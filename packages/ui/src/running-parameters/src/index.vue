<template>
  <BusinessCard title="参数曲线" min-width="1080" min-height="240">
    <template #operation>
      <div class="chart-type">
        <i :class="{ line_active: !isCurve, line: isCurve }" @click="handleChangeChart(false)"></i>
        <i :class="{ curver_active: isCurve, curver: !isCurve }" @click="handleChangeChart(true)"></i>
      </div>
      <el-tabs v-model="activeCategory">
        <el-tab-pane v-for="{ name, label } in categories" :key="name" :label="label" :name="name" />
      </el-tabs>
    </template>
    <SystemParameter
      v-if="activeCategory === 'systems'"
      :option="option"
      :parameter-configs="parameterConfigs"
      :width="908"
      :height="176"
      @change-system-config="handleChangeSystemConfig"
    >
    </SystemParameter>
    <EquipmentParameter
      v-if="activeCategory === 'equipments'"
      :option="option"
      :parameter-configs="parameterConfigs"
      :width="908"
      :height="176"
      @change-equipment-config="handleChangeEquipmentConfig"
    >
    </EquipmentParameter>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { ElTabPane, ElTabs } from '@edoms/design';
import { dateRange, formatCurrentDateRange, stringToDate } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

// import EdomsCharts from '../../EdomsCharts.vue';
import EquipmentParameter from './component/EquipmentParameter.vue';
import SystemParameter from './component/SystemParameter.vue';
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
const option = ref<ECOption>({});

const isCurve = ref<boolean>(false);

const lineUnit = ref<string[]>([]);

const parameterConfigs = computed<MParameterItemConfig[]>(() => {
  const result = props.config[activeCategory.value];
  if (result) {
    return result;
  }
  return [];
});

const activeIndicatorConfig = ref<Map<string, MIndicatorItemConfig>>(new Map<string, MIndicatorItemConfig>());

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const handleChangeSystemConfig = (conf: Map<string, MIndicatorItemConfig>) => {
  activeIndicatorConfig.value = conf;
};

const handleChangeEquipmentConfig = (conf: Map<string, MIndicatorItemConfig>) => {
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

  let chartSeries = [];
  chartSeries = result.map(({ insCode, propCode, dataList }, index) => {
    const activeIndicator = activeIndicatorConfig.value.get(`${insCode}:${propCode}`);
    const name = activeIndicator?.label;
    lineUnit.value.push(activeIndicator?.unit ?? '');
    return {
      name: name ? name : `未命名${index}`,
      type: 'line',
      showSymbol: false,
      smooth: isCurve.value,
      color: activeIndicator?.color,
      data: dataList.map(({ time, value }) => [stringToDate(time), value]),
    };
  });
  option.value = generateOption(chartSeries);
};

const handleChangeChart = (flag: boolean) => {
  if (isCurve.value === flag) return;
  isCurve.value = flag;
  flush();
};

const { flush } = useIntervalAsync(updateParameterData, intervalDelay.value);

watch(
  () => activeIndicatorConfig.value,
  () => {
    flush();
  }
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
        let content = params[0].axisValueLabel;
        for (const i in params) {
          content +=
            '<br/>' + params[i].marker + params[i].seriesName + ': ' + params[i].value[1] + lineUnit.value[Number(i)];
        }
        return content;
      },
    },
    grid: {
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
</script>

<style lang="scss" scoped>
.chart-type {
  position: absolute;
  right: 130px;
  display: flex;
  top: 12px;

  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .line {
    background: url('./assets/zhexian.png') no-repeat;
    background-size: cover;
  }
  .line_active {
    background: url('./assets/zhexian_active.png') no-repeat;
    background-size: cover;
  }

  .curver {
    background: url('./assets/quxian.png') no-repeat;
    background-size: cover;
  }

  .curver_active {
    background: url('./assets/quxian_active.png') no-repeat;
    background-size: cover;
  }
}
:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__item) {
  color: #ffffff65;
  padding: 0 4px;
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
