<template>
  <div class="wrapper">
    <el-tabs v-model="activeParameter" class="left-tabs" tab-position="left">
      <el-tab-pane v-for="({ label }, index) in parameterConfigs" :key="index" :label="label" :name="`${index}`" />
    </el-tabs>
    <EdomsCharts :option="option" :width="width" :height="height"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import { MSystemIndicatorConfig, MSystemParameterConfig } from '../type';

const props = defineProps<{
  option: ECOption;
  width: number;
  height: number;
  parameterConfigs: MSystemParameterConfig[];
}>();

const emit = defineEmits<{
  (event: 'changeSystemConfig', value: Map<string, MSystemIndicatorConfig>): void;
}>();

const activeParameter = ref<string>('0');

watch(
  () => activeParameter.value,
  (activeParameter) => {
    const result = new Map<string, MSystemIndicatorConfig>();
    if (!props.parameterConfigs[Number(activeParameter)].indicators) {
      return result;
    }
    props.parameterConfigs[Number(activeParameter)].indicators.forEach((config) =>
      result.set(`${config.instance[config.instance.length - 1]}:${config.property}`, config)
    );
    emit('changeSystemConfig', result);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}

:deep(.left-tabs) {
  & .el-tabs__item {
    width: 120px;
    text-align: center;
  }

  & .el-tabs__item.is-active {
    background-color: #333333;
  }
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__item) {
  color: #ffffff;
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
