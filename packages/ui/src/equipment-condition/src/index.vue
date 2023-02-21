<template>
  <div>
    <ElDrawer v-model="visible" direction="btt" size="95%">
      <template #header="{ titleId, titleClass }: any">
        <div :id="titleId" class="drawer-header" :class="titleClass" @click="visible = false">运行工况</div>
      </template>
      <div class="eq-wrapper">
        <div class="group-tabs">
          <button
            v-for="(group, index) in groups"
            :key="index"
            :class="activeName === group ? ['group-tab-pane', 'group-tab-pane-active'] : ['group-tab-pane']"
            @click="handleGroupTabChange(group)"
          >
            {{ group }}
          </button>
        </div>
        <ConditionCard
          v-for="(condition, index) in conditions"
          :key="index"
          :condition="condition"
          :charts-option="chartsOption"
        ></ConditionCard>
      </div>
    </ElDrawer>
    <div class="click-wrapper" @click="visible = true">运行工况</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElDrawer } from '@edoms/design';
import { dateRange } from '@edoms/utils';

import { ECOption } from '../../types';
import useApp from '../../useApp';

import ConditionCard from './component/ConditionCard.vue';
import { MConditionItemConfig, MEquipmentCondition } from './type';

const props = defineProps<{
  config: MEquipmentCondition;
}>();

useApp(props);

const visible = ref<boolean>(false);

const activeName = ref<string>('全部');

const chartsOption = ref<ECOption>({});

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

const handleGroupTabChange = (group: string) => {
  activeName.value = group;
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
