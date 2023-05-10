<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-10 14:01:45
-->
<template>
  <BusinessCard :title="props.config.title" :subtitle="props.config.subTitle" min-width="822" min-height="367">
    <div class="wrap-body" style="width: 100%; height: 100%">
      <div class="wrap-header">
        <div class="wrap-divide">
          <div v-for="item in [0, 1, 2]" :key="item" class="divide"></div>
        </div>
        <div v-for="item in categories" :key="item.label" class="wrap-tab">
          <div class="tab" :class="{ active: activeCategory === item.name }" @click="changeTab(item.name)">
            {{ item.label }}
          </div>
        </div>
      </div>
      <SystemParameter
        v-if="activeCategory === 'systems'"
        :option="option"
        :parameter-configs="parameterConfigs"
        @change-system-config="handleChangeSystemConfig"
      >
      </SystemParameter>

      <EquipmentParameter
        v-if="activeCategory === 'equipments'"
        :option="option"
        :parameter-configs="parameterConfigs"
        @change-equipment-config="handleChangeEquipmentConfig"
      >
      </EquipmentParameter>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { dateRange, formatCurrentDateRange, formatPrecision, stringToDate } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import EquipmentParameter from './component/EquipmentParameter.vue';
import SystemParameter from './component/SystemParameter.vue';
import apiFactory from './api';
import { MIndicatorItemConfig, MOperationalParameters, MParameterItemConfig } from './type';

const props = defineProps<{
  config: MOperationalParameters;
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

// const activeTab = ref<number>(0);

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

const changeTab = (name: string) => {
  if (activeCategory.value === name) return;
  activeCategory.value = name;
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
      data: dataList.map(({ time, value }) => [
        stringToDate(time),
        formatPrecision(+value, activeIndicator?.precision ?? ''),
      ]),
    };
  });
  option.value = generateOption(chartSeries);
};
const { flush } = useIntervalAsync(updateParameterData, intervalDelay.value);

// const updateLineData = () => {
//   const dataList = parameterConfigs.value;
//   console.log('我是曲线数据', dataList, activeIndicatorConfig.value);
// };

watch(
  () => activeIndicatorConfig.value,
  () => {
    // updateLineData();
    flush();
  }
);

function generateOption(series: any[] = []): ECOption {
  const legends = series.map(({ name }) => name);
  const colors = series.map(({ color }) => color);
  return {
    legend: {
      data: legends,
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 4,
      color: colors,
      textStyle: {
        color: '#EFF7FF',
        fontWeight: 400,
        fontSize: 12,
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
      left: '3%',
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
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(164, 218, 255, 0.2)',
        },
      },
      interval: 2,
      axisLabel: {
        formatter: '{HH}:{mm}',
        interval: 2,
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 300,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(164, 218, 255, 0.16)',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#FDFEFF',
        fontSize: 10,
      },
      nameTextStyle: {
        color: '#D8D8D8',
        fontWeight: 300,
        fontSize: 10,
      },
    },
    series,
  };
}
</script>

<style lang="scss" scoped>
.wrap-info {
  width: 100%;
  height: 100%;
  //   background-color: green;
}
.wrap-body {
  width: 100%;
  //   height: 300px;
  border: 1px solid rgba($color: #215898, $alpha: 0.5);
  .wrap-header {
    margin-left: 20px;
    margin-top: 10px;
    width: calc(100% - 40px);
    min-height: 31px;
    border-top: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    border-bottom: 1px solid rgba($color: #00a3ff, $alpha: 0.3);
    display: flex;
    align-items: center;
    position: relative;
    //   justify-content: center;
    .wrap-divide {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: all;
      .divide {
        width: 1px;
        height: 12px;
        background-color: rgba($color: #00a3ff, $alpha: 0.3);
      }
    }
    .wrap-tab {
      width: 50%;
      min-height: 20px;
      font-size: 14px;
      text-align: center;
      line-height: 20px;
      pointer-events: all;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      .tab {
        min-width: 260px;
        height: 100%;
        background: rgba($color: #00a3ff, $alpha: 0.1);
        color: #c4e5f8;
        cursor: pointer;
        &.active {
          background: rgba(0, 163, 255, 0.16);
          border: 1px solid #007bc0;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
