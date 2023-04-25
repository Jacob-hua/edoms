<template>
  <div class="wrapper">
    <el-tabs v-model="activeParameter" class="left-tabs" tab-position="left">
      <el-tab-pane v-for="({ label }, index) in parameterConfigs" :key="index" :name="`${index}`">
        <template #label>
          <div :title="label">{{ label }}</div>
        </template>
      </el-tab-pane>
    </el-tabs>
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
}>();

const activeParameter = ref<string>('0');

const activeIndicatorConfig = computed<Map<string, MIndicatorItemConfig>>(() => {
  const result = new Map<string, MIndicatorItemConfig>();
  if (!props.parameterConfigs.length || !props.parameterConfigs[Number(activeParameter.value)].indicators) {
    return result;
  }
  props.parameterConfigs[Number(activeParameter.value)].indicators.forEach((config) =>
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
  height: 100%;
  display: flex;
  padding: 12px 0px;
  box-sizing: border-box;
  width: 100%;
}

:deep(.left-tabs) {
  min-width: 122px;
  margin-right: 20px;
  max-width: 10%;
  & .el-tabs__item {
    text-align: center;

    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  & .el-tabs__item.is-active {
    background-color: #333333;
  }
  .el-tabs__header {
    width: 100%;
    height: 100%;
    overflow: auto;
    margin: 0;

    .el-tabs__nav-wrap {
      height: auto;
    }
  }

  .el-tabs__header::-webkit-scrollbar {
    display: none;
  }

  .el-tabs__nav {
    z-index: inherit;
  }
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

.charts {
  flex-grow: 1;
  height: 100%;
}
</style>
