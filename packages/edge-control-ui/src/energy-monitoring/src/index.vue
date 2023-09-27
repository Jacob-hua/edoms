<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-06-05 17:23:12
-->
<template>
  <div style="min-width: 522px; min-height: 213px">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="522" min-height="213">
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
      :title="dialogTitle"
      :width="1360"
      :height="570"
      :options="options"
      @type-change="handleChangeDateType"
      @magictype-change="handleChangeMagictype"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { daysInMonth, formatDate, formatDateRange, formatPrecision, UnitTime } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import ActualCard from './component/ActualCard.vue';
import ColorLegend from './component/ColorLegend.vue';
import EChartsDialog from './component/EChartsDialog.vue';
import LinearCard from './component/LinearCard.vue';
import apiFactory from './api';
import locales from './locales';
import { MEnergyMonitoring } from './type';

const props = defineProps<{
  config: MEnergyMonitoring;
}>();

const { request, setMessage } = useApp(props);

const { fetchRealData, fetchHistoryData } = apiFactory(request);

setMessage(locales);

const actualValue = ref<number>(0);
const energyConfig = computed<MEnergyMonitoring>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const updateEfficiencyData = async () => {
  if (!energyConfig.value.instance) {
    return;
  }
  const dataCodes: string[] = [energyConfig.value.property];

  if (dataCodes.length === 0) {
    return;
  }

  const result = await fetchRealData({ dataCodes });
  result.forEach(() => {
    actualValue.value = +formatPrecision(Math.random() * 7, energyConfig.value.precision);
  });
};

const chartDialogVisible = ref<boolean>(false);

const dialogTitle = ref<string>('');

const magictype = ref<string>('line');

const chartSeries = ref<any[]>([]);

const dateType = ref<UnitTime>('day');

const energyName = ref<string>('COP');

const efficiencyConfig = computed<MEnergyMonitoring>(() => props.config);

const options = computed<ECOption>(() => {
  return {
    legend: {
      show: true,
      textStyle: {
        color: '#ffffff85',
      },
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          type: ['line', 'bar'],
        },
      },
      showTitle: false,
      right: '10%',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
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
    series: chartSeries.value.map((item) => {
      item.type = magictype.value;
      return item;
    }),
  };
});

const xAxisData = computed(() => {
  let defaultResult = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];
  if (dateType.value === 'day') {
    return defaultResult;
  } else if (dateType.value === 'month') {
    const days = daysInMonth(new Date());
    defaultResult = [];
    for (let i = 1; i <= days; i++) {
      defaultResult.push(i < 10 ? `0${i}` : `${i}`);
    }
    return defaultResult;
  } else {
    defaultResult = [];
    for (let i = 1; i <= 12; i++) {
      defaultResult.push(i < 10 ? `0${i}` : `${i}`);
    }
    return defaultResult;
  }
});

const formatXAxisLabel = computed(() => {
  if (dateType.value === 'day') {
    return 'HH:mm';
  }
  if (dateType.value === 'month') {
    return 'dd';
  }
  if (dateType.value === 'year') {
    return 'MM';
  }
  return 'HH:mm';
});

const handleShowMore = () => {
  dialogTitle.value = '能效监测';
  getHistoryData(new Date(), 'day');
  chartDialogVisible.value = true;
};

const handleChangeDateType = (type: UnitTime) => {
  dateType.value = type;
  magictype.value = 'line';
  getHistoryData(new Date(), type);
};

const handleChangeMagictype = (value: string) => {
  magictype.value = value;
};

const getHistoryData = async (date: Date, type: UnitTime = 'day') => {
  const { start, end } = formatDateRange(date, type, 'YYYY-MM-DD HH:mm:ss');
  let interval = '1h';
  if (type === 'day') {
    interval = '1h';
  } else if (type === 'month') {
    interval = '1d';
  } else {
    interval = '1n';
  }
  const result = await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: interval,
    type: 'dev',
    dataList: [
      {
        deviceCode: efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1] ?? '',
        propCode: 'COP',
      },
    ],
  });
  chartSeries.value = result.map(({ dataList }, index) => ({
    name: energyName.value ? energyName : `未命名${index}`,
    type: magictype.value,
    showSymbol: false,
    data: dataList.map(({ time, value }) => {
      const label = formatDate(time, formatXAxisLabel.value);
      return [label, formatPrecision(+value, efficiencyConfig.value.precision)];
    }),
    itemStyle: {
      color: efficiencyConfig.value?.lineColor,
    },
  }));
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-body {
  width: 100%;
  min-height: 205px;
  display: flex;
  .left {
    height: calc(100% - 100px);
    min-width: 124px;
    width: 24%;
    margin-left: 20px;
    margin-top: 21px;
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
    margin: 25px 32px 28px 30px;
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
    }
  }
}
.operation {
  font-size: 22px;
  cursor: pointer;
  color: #ffffff85;
}
</style>
