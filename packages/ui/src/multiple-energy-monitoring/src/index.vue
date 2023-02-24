<template>
  <div class="multiple-efficiency-container">
    <BusinessCard title="能效监测" subtitle="ENERGY EFFICIENCY MONITORING" min-width="392" min-height="160">
      <template #operation>
        <div :class="operatable" @click="handleShowMore">...</div>
      </template>
      <div class="efficiency-wrapper">
        <div v-for="(item, index) in initEfficiencys" :key="index" class="efficiency-row">
          <div class="efficiency-col overflow-ellipsis">{{ item.energyName }}</div>
          <div class="efficiency-col efficiency-progress">
            <el-progress
              :stroke-width="24"
              :color="efficiencyColor"
              :text-inside="true"
              :percentage="item.percentage"
              >{{ item.efficiencyNum }}</el-progress
            >
            <div class="target-line" :style="{ right: item.targetPosition }"></div>
          </div>
        </div>
        <div class="wrap-footer">
          <div class="legend-acture">
            <div class="legend-acture-box"></div>
            <span class="legend-text">实际值</span>
          </div>
          <div class="legend-target">
            <div class="legend-target-box"></div>
            <span class="legend-text">目标值</span>
          </div>
        </div>
      </div>
    </BusinessCard>
    <MoreEnergyEffciency
      v-if="moreEfficiencyVisible"
      v-model:visible="moreEfficiencyVisible"
      :acture-color="efficiencyColor"
      :target-color="targetLineColor"
      :data="restEfficiencys"
    >
    </MoreEnergyEffciency>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import { FetchEfficiencyRes } from '../../energy-efficiency-monitoring/src/type';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import MoreEnergyEffciency from './component/MoreEnergyEffciency.vue';
import apiFactory from './api';
import { EnergyEfficiency, FetchEfficiencyReq, MEfficiencyConfigs, MEfficiencyMonitoring } from './type';

const PROGRESS_WIDTH = 302;
const props = defineProps<{
  config: MEfficiencyConfigs;
}>();

const moreEfficiencyVisible = ref<boolean>(false);

const energyEfficiencys = ref<EnergyEfficiency[]>([]);

const { request } = useApp(props);

const { fetchEfficiencyData } = apiFactory(request);

const efficiencyConfigs = computed<MEfficiencyMonitoring[]>(() => props.config.monitorings);
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const efficiencyColor = computed(() => props.config.efficiencyColor);
const targetLineColor = computed(() => props.config.targetLineColor);
const initEfficiencys = computed(() => {
  if (energyEfficiencys.value && energyEfficiencys.value.length > 2) {
    return energyEfficiencys.value?.slice(0, 2);
  } else {
    return energyEfficiencys.value;
  }
});
const restEfficiencys = computed(() => {
  if (energyEfficiencys.value && energyEfficiencys.value.length > 2) {
    return energyEfficiencys.value?.slice(2);
  } else {
    return [];
  }
});
const operatable = computed(() => (restEfficiencys.value.length ? 'operation' : 'dis-operation'));

watch(
  () => efficiencyConfigs.value,
  (val) => {
    if (!val || val.length <= 0) return;
    energyEfficiencys.value = val.map((item) => ({
      instance: item.instance,
      minValue: item.minValue,
      maxValue: item.maxValue,
      targetValue: item.targetValue,
      energyName: item.energyName,
      efficiencyNum: '0',
      percentage: 0,
      targetPosition: `${PROGRESS_WIDTH}px`,
    }));
  },
  {
    immediate: true,
  }
);

const calculatePosition = (result: FetchEfficiencyRes) => {
  energyEfficiencys.value.map((item) => {
    item.efficiencyNum =
      result[result.findIndex(({ insCode }) => insCode === item.instance[item.instance.length - 1])].efficiencyNum;
    const minValue = Number(item.minValue);
    const maxValue = Number(item.maxValue);
    const efficiencyNum = Number(item.efficiencyNum);
    const targetValue = Number(item.targetValue);
    if (efficiencyNum <= minValue) {
      item.percentage = 0;
    } else if (efficiencyNum >= maxValue) {
      item.percentage = 100;
    } else {
      item.percentage = ((efficiencyNum - minValue) / (maxValue - minValue)) * 100;
    }
    if (targetValue <= minValue) {
      item.targetPosition = `${PROGRESS_WIDTH}px`;
    } else if (targetValue >= maxValue) {
      item.targetPosition = '0px';
    } else {
      const targetLinePercent = (targetValue - minValue) / (maxValue - minValue);
      item.targetPosition = `${PROGRESS_WIDTH * (1 - targetLinePercent)}px`;
    }
    return item;
  });
};

const updateEfficiencyData = async () => {
  if (!efficiencyConfigs.value || efficiencyConfigs.value.length <= 0) {
    return;
  }
  const param: FetchEfficiencyReq = {
    insCodeList: efficiencyConfigs.value.map(({ instance }) => instance[instance.length - 1]),
    propCode: 'COP',
  };
  const result = await fetchEfficiencyData(param);
  if (!result || result.length <= 0) return;
  calculatePosition(result);
};

const handleShowMore = () => {
  restEfficiencys.value?.length && (moreEfficiencyVisible.value = true);
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.multiple-efficiency-container {
  display: flex;
}

.overflow-ellipsis {
  width: 46px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.efficiency-wrapper {
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 12px;
  box-sizing: border-box;

  .efficiency-row {
    display: flex;
    position: relative;
    box-sizing: border-box;
    width: 356px;
    margin: 8px 20px 8px 16px;
    align-items: center;
    justify-content: space-between;

    .efficiency-progress {
      width: 302px;
    }
  }

  :deep(.el-progress-bar__outer) {
    border-radius: 0;
    background-color: #ffffff45;

    .el-progress-bar__inner {
      border-radius: 0;
    }

    .el-progress-bar__innerText {
      color: #ffffff85;
    }
  }

  .target-line {
    width: 2px;
    height: 30px;
    background: v-bind(targetLineColor);
    position: absolute;
    top: -2px;
  }

  .wrap-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 8px;

    .legend-acture,
    .legend-target {
      display: flex;
      margin: 0 10px;
      align-items: center;
    }

    .legend-acture-box {
      width: 16px;
      height: 16px;
      background: v-bind(efficiencyColor);
    }

    .legend-target-box {
      width: 2px;
      height: 16px;
      background: v-bind(targetLineColor);
    }

    .legend-text {
      margin-left: 8px;
    }
  }
}
</style>
