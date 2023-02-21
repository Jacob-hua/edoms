<template>
  <div>
    <ElDrawer v-model="visible" direction="btt" size="95%">
      <template #header="{ titleId, titleClass }: any">
        <div :id="titleId" class="drawer-header" :class="titleClass" @click="visible = false">运行工况</div>
      </template>
      <div class="eq-wrapper">
        <div ref="groupTabsRef" class="group-tabs">
          <button
            v-for="(group, index) in groups"
            :key="index"
            :class="activeName === group ? ['group-tab-pane', 'group-tab-pane-active'] : ['group-tab-pane']"
            @click="handleGroupTabChange(group)"
          >
            <LongText
              :content="group"
              :content-style="{ width: 'inherit', fontSize: 'inherit', textAlign: 'center' }"
            ></LongText>
          </button>
        </div>
        <ConditionCard
          v-for="(condition, index) in conditions"
          :key="index"
          :condition="condition"
          :charts-option="chartsOption"
          @active-change="(value) => handleActiveParameterChange(value, condition)"
        ></ConditionCard>
      </div>
    </ElDrawer>
    <div class="click-wrapper" @click="visible = true">运行工况</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

import { ElDrawer } from '@edoms/design';
import { dateRange, formatCurrentDateRange } from '@edoms/utils';

import LongText from '../../LongText.vue';
import { ECOption } from '../../types';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import ConditionCard from './component/ConditionCard.vue';
import apiFactory from './api';
import { MConditionItemConfig, MEquipmentCondition, MIndicatorItemConfig } from './type';

const props = defineProps<{
  config: MEquipmentCondition;
}>();

const { request } = useApp(props);

const { fetchHistoryData } = apiFactory(request);

const visible = ref<boolean>(false);

const groupTabsRef = ref<HTMLElement>();

const activeName = ref<string>('全部');

const chartsOption = ref<ECOption>({});

const historyIndicatorMap = ref<Map<string, MIndicatorItemConfig | undefined>>(new Map());

const groups = computed<Set<string>>(() => {
  const result = new Set<string>();
  result.add('全部');
  return (
    props.config.groups?.reduce((groups, { group }) => {
      groups.add(group);
      return groups;
    }, result) ?? result
  );
});

const conditions = computed<MConditionItemConfig[]>(() => {
  if (activeName.value === '全部') {
    return props.config.conditions;
  }
  return props.config.conditions.filter(({ group }) => group === activeName.value);
});

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 1000;
  }
  return props.config.intervalDelay;
});

watch(
  () => groupTabsRef.value,
  (groupTabsRef) => {
    if (!groupTabsRef) {
      return;
    }
    groupTabsRef.addEventListener('wheel', handleWheelChange, { passive: true });
  }
);

onUnmounted(() => {
  if (groupTabsRef.value) {
    groupTabsRef.value.removeEventListener('wheel', handleWheelChange);
  }
});

const updateIndicatorsData = async () => {
  const { start, end } = formatCurrentDateRange('day', 'YYYY-MM-DD HH:mm:ss');
  await fetchHistoryData({
    startTime: start,
    endTime: end,
    interval: '1h',
    type: 'dev',
    dataList: [],
  });
};

useIntervalAsync(updateIndicatorsData, intervalDelay.value);

chartsOption.value = generateOption();

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

function handleWheelChange(event: WheelEvent) {
  event.preventDefault();
  if (!groupTabsRef.value) {
    return;
  }
  groupTabsRef.value.scrollLeft += event.deltaY;
}

const handleGroupTabChange = (group: string) => {
  activeName.value = group;
};

const handleActiveParameterChange = (activeParameter: string, condition: MConditionItemConfig) => {
  const indicator = condition.indicators.find(({ label }) => label === activeParameter);
  historyIndicatorMap.value.set(condition.label, indicator);
};
</script>

<style lang="scss" scoped>
$tabPanBg: #29292a;
$tabPanColor: #999999;
$tabPanActiveColor: #00ffff;
$borderColor: #505152;

:deep(.el-drawer) {
  --el-drawer-bg-color: rgb(19, 20, 21);
}
:deep(.el-drawer__header) {
  margin-bottom: 25px;
  padding: 0;
}
.click-wrapper {
  width: inherit;
  height: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  padding: 0 14px;
}
.drawer-header {
  background-color: rgb(41, 41, 42);
  height: 60px;
  line-height: 60px;
  padding: 0 14px;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}
.eq-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 12px;
}
.group-tabs {
  grid-column: 1 / span 2;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
.group-tab-pane {
  width: 86px;
  height: 42px;
  line-height: 40px;
  background: $tabPanBg;
  border: 1px solid $borderColor;
  border-radius: 3px;
  color: $tabPanColor;
  margin-right: 4px;

  &-active {
    border-bottom: 2px solid $tabPanActiveColor;
    color: $tabPanActiveColor;
    background-color: transparent;
  }
}
</style>
