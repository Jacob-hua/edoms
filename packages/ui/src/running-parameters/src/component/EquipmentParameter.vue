<template>
  <div class="wrapper">
    <div class="select-box">
      <el-select v-model="equipIndex" filterable>
        <el-option
          v-for="(item, index) in equipmentConfigs"
          :key="index"
          :value="`${index}`"
          :label="item.label"
        ></el-option>
      </el-select>
    </div>
    <el-tabs v-model="activeParameter" class="left-tabs" tab-position="left">
      <el-tab-pane v-for="({ label }, index) in parameterConfigs" :key="index" :label="label" :name="`${index}`" />
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
  (event: 'changeEquipmentConfig', value: Map<string, MIndicatorItemConfig>): void;
}>();

const activeParameter = ref<string>('0');

const equipmentConfigs = ref<MIndicatorItemConfig[]>([]);

const equipIndex = ref<string>('0');

const activeIndicatorConfig = computed<Map<string, MIndicatorItemConfig>>(() => {
  const result = new Map<string, MIndicatorItemConfig>();
  if (!equipmentConfigs.value.length || !equipmentConfigs.value[Number(equipIndex.value)]) {
    return result;
  }
  const equipment = equipmentConfigs.value[Number(equipIndex.value)];
  result.set(`${equipment.instance[equipment.instance.length - 1]}:${equipment.property}`, equipment);
  return result;
});

watch(
  () => activeParameter.value,
  (activeParameter) => {
    equipIndex.value = '0';
    if (!props.parameterConfigs[Number(activeParameter)]) {
      return;
    }
    equipmentConfigs.value = props.parameterConfigs[Number(activeParameter)].indicators;
  },
  {
    immediate: true,
  }
);

watch(
  () => activeIndicatorConfig.value,
  () => {
    emit('changeEquipmentConfig', activeIndicatorConfig.value);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 12px 16px;
  box-sizing: border-box;

  .select-box {
    --dark-background: rgba(31, 30, 29, 1);
    position: absolute;
    right: 30px;
    width: 1.5rem;
    z-index: 2;

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px #ffffff45 inset;
      background: rgba(31, 30, 29, 1);
    }

    :deep(.el-input__inner) {
      height: 20px;
      color: #ffffff85;
    }
  }
}

:deep(.left-tabs) {
  min-width: 122px;
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

.charts {
  flex-grow: 1;
  height: 100%;
}
</style>
