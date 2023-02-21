<template>
  <div class="eq-condition">
    <div class="eq-title">{{ condition.label }}</div>
    <div class="eq-indicators">
      <div v-for="(indicator, index) in condition.indicators" :key="index" class="eq-indicator">
        <LongText class="label" :content="indicator.label" :content-style="indicatorTitleStyle"></LongText>
        <LongText class="value" content="21.2" :content-style="indicatorValueStyle"></LongText>
      </div>
    </div>
    <div class="eq-indicator-tabs">
      <button
        v-for="(indicator, index) in indicators"
        :key="index"
        :class="indicator.label === activeTabIndicator ? ['eq-indicator-tab-active'] : []"
        @click="handleIndicatorTabChange(indicator)"
      >
        <LongText :content="indicator.label" :content-style="{ fontSize: '14px' }"></LongText>
      </button>
      <ElSelect
        v-if="otherIndicators.length"
        v-model="activeOtherIndicator"
        class="eq-indicator-tabs-more"
        placeholder="其他参数"
        @change="handleOtherIndicatorChange"
      >
        <ElOption
          v-for="(indicator, index) in otherIndicators"
          :key="index"
          :label="indicator.label"
          :value="indicator.label"
        ></ElOption>
      </ElSelect>
    </div>
    <div class="eq-indicator-chart">
      <EdomsCharts :option="chartsOption" :width="685" :height="220"></EdomsCharts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { ElOption, ElSelect } from '@edoms/design';

import EdomsCharts from '../../../EdomsCharts.vue';
import LongText from '../../../LongText.vue';
import { ECOption } from '../../../types';
import { MConditionItemConfig, MIndicatorItemConfig } from '../type';

const props = defineProps<{
  condition: MConditionItemConfig;
  chartsOption: ECOption;
}>();

const indicators = ref<MIndicatorItemConfig[]>([]);

const otherIndicators = ref<MIndicatorItemConfig[]>([]);

const activeTabIndicator = ref<string>('');

const activeOtherIndicator = ref<string>('');

const indicatorTitleStyle = computed<Record<string, any> | undefined>(() => ({
  fontSize: '14px',
  textAlign: 'center',
  width: '100px',
}));

const indicatorValueStyle = computed<Record<string, any> | undefined>(() =>
  props.condition.color
    ? { color: props.condition.color, fontSize: '8px', textAlign: 'center' }
    : { fontSize: '8px', textAlign: 'center' }
);

watch(
  () => props.condition.indicators,
  (value) => {
    indicators.value = value.slice(0, 5);
    otherIndicators.value = value.slice(5);

    activeTabIndicator.value = indicators.value?.[0].label;
  },
  {
    immediate: true,
  }
);

const handleIndicatorTabChange = (indicator: MIndicatorItemConfig) => {
  activeTabIndicator.value = indicator.label;
  activeOtherIndicator.value = '';
};

const handleOtherIndicatorChange = (value: string) => {
  if (value) {
    activeTabIndicator.value = '';
  }
};
</script>

<style lang="scss">
:root {
  --el-bg-color-overlay: #1f1f1f;
  --el-fill-color-light: #505152;
  --el-color-primary: #ffffff;
}
</style>

<style lang="scss" scoped>
$borderColor: #505152;

$eqBg: #272727;
$eqTitleColor: #ffffff;
$eqIndicatorColor: #999999;
:deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-color: #505152;
  --el-input-text-color: #ffffff;
}
:deep(.el-select) {
  background-color: transparent;
  --el-select-input-focus-border-color: #ffffff;
}
.eq-condition {
  width: 912px;
  height: 340px;
  background-color: $eqBg;
  border-radius: 3px;
  border: 1px solid $borderColor;
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-template-columns: 164px 1fr;
  padding: 30px 16px;
  row-gap: 4px;
  column-gap: 30px;
  box-sizing: border-box;
}
.eq-title {
  color: $eqTitleColor;
  font-size: 14px;
  line-height: 40px;
}
.eq-indicators {
  grid-column: 1 / span 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.eq-indicator {
  display: flex;
  border: 1px solid $borderColor;
  border-radius: 3px;
  color: $eqIndicatorColor;
  margin-top: 4px;
  line-height: 30px;
  .label {
    border-right: 1px solid $borderColor;
  }
  .value {
    flex-grow: 1;
  }
}
.eq-indicator-tabs {
  grid-column: 2;
  grid-row: 1;

  display: grid;
  grid-template-columns: repeat(6, 1fr);

  &-more {
    width: 100%;
    background-color: transparent;
  }

  button {
    background-color: transparent;
    color: $eqIndicatorColor;
    border: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &::after {
      content: '';
      margin-top: 2px;
      height: 2px;
    }
  }
}
.eq-indicator-tab-active {
  color: #ffffff !important;

  &::after {
    content: '';
    display: inline-block;
    width: 60px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 1px;
  }
}
.eq-indicator-chart {
  grid-row: 2;
  grid-column: 2;
}
</style>
