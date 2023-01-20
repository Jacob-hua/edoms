<template>
  <div class="efficiency-container">
    <BusinessCard title="能效监测" subtitle="ENERGY EFFICIENCY MONITORING" min-width="392" min-height="160">
      <template #operation>
        <div :class="operatable" @click="handleShowMore">...</div>
      </template>
      <div class="efficiency-wrapper">
        <div class="actual-wrapper">
          <div class="actual-value">{{ efficinecyData.actualValue }}</div>
          <div class="actual-unit">{{ efficinecyData.energyName }}</div>
        </div>
        <div>
          <Efficiency v-bind="efficinecyData"></Efficiency>
        </div>
      </div>
    </BusinessCard>
    <EChartsDialog
      v-if="chartDialogVisible"
      v-model:visible="chartDialogVisible"
      :title="dialogTitle"
      :width="960"
      :height="480"
      :options="options"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import EChartsDialog from './component/EChartsDialog.vue';
import Efficiency from './component/Efficiency.vue';
import apiFactory from './api';
import { FetchEfficiencyReq, MEfficiencyMonitoring } from './type';

interface EfficinecyData {
  minValue: string;
  maxValue: string;
  referenceValue: string;
  actualValue: string;
  bisectionNumber?: number;
  startColor: string;
  endColor: string;
  cursorColor?: string;
  referenceLineColor?: string;
  energyName?: string;
}

const props = defineProps<{
  config: MEfficiencyMonitoring;
}>();

const { request } = useApp(props);

const { fetchEfficiencyData } = apiFactory(request);

// const efficinecyData = ref<EfficinecyData>({
//   minValue: '',
//   maxValue: '',
//   referenceValue: '',
//   actualValue: '',
//   startColor:'',
//   endColor: '',
// });
const chartDialogVisible = ref<boolean>(false);
const dialogTitle = ref<string>('');
const options = ref<ECOption>({
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
  xAxis: {
    type: 'time',
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: true,
    },
  },
  series: [],
});

const efficiencyConfig = computed<MEfficiencyMonitoring>(() => props.config);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

const operatable = computed(() => 'operation');

const efficinecyData = computed<EfficinecyData>(() => ({
  minValue: efficiencyConfig.value.minValue ?? '',
  maxValue: efficiencyConfig.value.maxValue ?? '',
  referenceValue: efficiencyConfig.value.refrenceValue ?? '',
  referenceLineColor: efficiencyConfig.value.refrenceLineColor,
  actualValue: '',
  bisectionNumber: efficiencyConfig.value.bisectionNumber,
  startColor: efficiencyConfig.value.startColor ?? '',
  endColor: efficiencyConfig.value.endColor ?? '',
  cursorColor: efficiencyConfig.value.cursorColor,
  energyName: efficiencyConfig.value.energyName ?? '',
}));

// watch(
//   () => efficiencyConfig.value,
//   (efficiencyConfig) => {
//     efficinecyData.value = {
//       minValue: efficiencyConfig.minValue??'',
//       maxValue: efficiencyConfig.maxValue??'',
//       referenceValue: efficiencyConfig.refrenceValue??'',
//       referenceLineColor: efficiencyConfig.refrenceLineColor,
//       actualValue: '',
//       bisectionNumber: efficiencyConfig.bisectionNumber,
//       startColor: efficiencyConfig.startColor??'',
//       endColor: efficiencyConfig.endColor??'',
//       cursorColor: efficiencyConfig.cursorColor,
//       energyName: efficiencyConfig.energyName??''
//     }
//   },
//   {
//     immediate: true,
//   }
// );

const updateEfficiencyData = async () => {
  if (!efficiencyConfig.value.instance || !efficiencyConfig.value.property) {
    return;
  }
  const param: FetchEfficiencyReq = {
    insCodeList: [efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1]],
    propCode: efficiencyConfig.value.property,
  };
  const result = await fetchEfficiencyData(param);
  result.forEach(({ insCode, efficiencyNum }) => {
    if (insCode !== efficiencyConfig.value.instance[efficiencyConfig.value.instance.length - 1]) {
      return;
    }
    efficinecyData.value.actualValue = efficiencyNum;
  });
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);

const handleShowMore = () => {};
</script>

<style lang="scss" scoped>
.efficiency-container {
  display: flex;
}

.operation {
  font-size: 28px;
  cursor: pointer;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff85;
  text-align: center;
}

.dis-operation {
  font-size: 28px;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff45;
  text-align: center;
  cursor: default;
}

.open {
  font-size: 36px;
  cursor: pointer;
  position: relative;
  top: -14px;
}

.efficiency-wrapper {
  width: 100%;
  display: flex;
  align-items: center;

  .actual-wrapper {
    margin-right: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;

    .actual-value {
      font-size: 28px;
      font-weight: 800;
      color: greenyellow;
      margin-bottom: 10px;
    }
  }
}
</style>
