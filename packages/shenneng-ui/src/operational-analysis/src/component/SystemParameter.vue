<template>
  <div class="wrapper">
    <div class="left-tab">
      <div
        v-for="({ label }, index) in parameterConfigs"
        :key="index"
        class="button-tab"
        :class="{ active: activeTab === index }"
        @click="changeTab(index)"
      >
        {{ label }}
      </div>
    </div>
    <EdomsCharts class="charts" :option="option"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import { MIndicatorItemConfig, MParameterItemConfig } from '../type';

const props = defineProps<{
  option: ECOption;
  parameterConfigs: MParameterItemConfig[];
}>();

const emit = defineEmits<{
  (event: 'changeSystemConfig', value: Map<string, MIndicatorItemConfig>): void;
  (event: 'changeActiveTab', value: number): void;
}>();

const activeTab = ref<number>(0);

const changeTab = (index: number) => {
  if (activeTab.value === index) return;
  activeTab.value = index;
  emit('changeActiveTab', activeTab.value);
};

// const activeParameter = ref<string>('0');

const activeIndicatorConfig = computed<Map<string, MIndicatorItemConfig>>(() => {
  const result = new Map<string, MIndicatorItemConfig>();
  if (!props.parameterConfigs.length || !props.parameterConfigs[activeTab.value].indicators) {
    return result;
  }
  props.parameterConfigs[activeTab.value].indicators.forEach((config) =>
    result.set(`${config.instance[config.instance.length - 1]}:${config.property}`, config)
  );
  return result;
});

watch(
  () => activeIndicatorConfig.value,
  () => {
    emit('changeSystemConfig', activeIndicatorConfig.value);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper {
  height: calc(100% - 41px);
  display: flex;
  box-sizing: border-box;
  width: 100%;
  .left-tab {
    min-width: 110px;
    height: calc(100% - 20px);
    width: 13.4%;
    margin-left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    .button-tab {
      width: calc(100% - 10px);
      // height: 24px;
      margin-bottom: 20px;
      line-height: 24px;
      cursor: pointer;
      background: url('../assets/button_default.png') no-repeat;
      background-size: cover;

      &.active {
        background: url('../assets/button_active.png') no-repeat;
        background-size: cover;
      }
    }
  }
}
.charts {
  flex-grow: 1;
  height: 100%;
}
</style>
