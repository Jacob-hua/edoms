<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard title="能效监测" subtitle="ENERGY EFFICIENCY MONITORING" min-width="392" min-height="160">
      <template #operation>
        <div :class="operationClass" @click="handleShowMore">...</div>
      </template>
      <div class="efficiency-wrapper">
        <div v-for="(item, index) in initEfficiencies" :key="index" class="efficiency-row">
          <div class="efficiency-col overflow-ellipsis">{{ item.energyName }}</div>
          <div ref="efficiencyProgressRef" class="efficiency-col efficiency-progress">
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
    <MoreEnergyEfficiency
      v-if="moreEfficiencyVisible"
      v-model:visible="moreEfficiencyVisible"
      :acture-color="efficiencyColor"
      :target-color="targetLineColor"
      :data="restEfficiencies"
    >
    </MoreEnergyEfficiency>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import { FetchEfficiencyRes } from '../../energy-efficiency-monitoring/src/type';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import MoreEnergyEfficiency from './component/MoreEnergyEfficiency.vue';
import apiFactory from './api';
import { EnergyEfficiency, FetchEfficiencyReq, MEfficiencyConfigs, MEfficiencyMonitoring } from './type';

const props = defineProps<{
  config: MEfficiencyConfigs;
}>();

const { request } = useApp(props);

const efficiencyProgressRef = ref<HTMLElement[]>();

const progressWidth = ref<number>(0);

const moreEfficiencyVisible = ref<boolean>(false);

const energyEfficiencies = ref<EnergyEfficiency[]>([]);

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
const initEfficiencies = computed(() => {
  if (energyEfficiencies.value && energyEfficiencies.value.length > 2) {
    return energyEfficiencies.value?.slice(0, 2);
  } else {
    return energyEfficiencies.value;
  }
});
const restEfficiencies = computed(() => {
  if (energyEfficiencies.value && energyEfficiencies.value.length > 2) {
    return energyEfficiencies.value?.slice(2);
  } else {
    return [];
  }
});
const operationClass = computed(() => (restEfficiencies.value.length ? 'operation' : 'dis-operation'));

watch(
  () => efficiencyConfigs.value,
  (val) => {
    if (!val || val.length <= 0) return;
    energyEfficiencies.value = val.map((item) => ({
      instance: item.instance,
      minValue: item.minValue,
      maxValue: item.maxValue,
      targetValue: item.targetValue,
      energyName: item.energyName,
      efficiencyNum: '0',
      percentage: 0,
      targetPosition: `${progressWidth.value}px`,
    }));
  },
  {
    immediate: true,
  }
);

const progressResizeObserver = new ResizeObserver(() => {
  if (!Array.isArray(efficiencyProgressRef.value) || efficiencyProgressRef.value.length === 0) {
    return;
  }

  progressWidth.value = efficiencyProgressRef.value[0].clientWidth;
});

onMounted(() => {
  nextTick(() => {
    if (!Array.isArray(efficiencyProgressRef.value) || efficiencyProgressRef.value.length === 0) {
      return;
    }
    progressResizeObserver.observe(efficiencyProgressRef.value[0]);
    progressWidth.value = efficiencyProgressRef.value[0]?.clientWidth ?? 0;
  });
});

onUnmounted(() => {
  if (!Array.isArray(efficiencyProgressRef.value) || efficiencyProgressRef.value.length === 0) {
    return;
  }
  progressResizeObserver.unobserve(efficiencyProgressRef.value[0]);
});

const calculatePosition = (result: FetchEfficiencyRes) => {
  energyEfficiencies.value.map((item) => {
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
      item.targetPosition = `${progressWidth.value}px`;
    } else if (targetValue >= maxValue) {
      item.targetPosition = '0px';
    } else {
      const targetLinePercent = (targetValue - minValue) / (maxValue - minValue);
      item.targetPosition = `${progressWidth.value * (1 - targetLinePercent)}px`;
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
  restEfficiencies.value?.length && (moreEfficiencyVisible.value = true);
};

useIntervalAsync(updateEfficiencyData, intervalDelay.value);
</script>

<style lang="scss" scoped>
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
  justify-content: space-around;
  box-sizing: border-box;

  .efficiency-row {
    display: flex;
    position: relative;
    box-sizing: border-box;
    margin: 8px 20px 8px 16px;
    align-items: center;
    justify-content: space-between;

    .efficiency-progress {
      width: 100%;
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
