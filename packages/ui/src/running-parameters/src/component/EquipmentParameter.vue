<template>
  <div class="wrapper">
    <div class="select-box">
      <el-select v-model="equipName" filterable>
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :value="item.instanceName"
          :label="item.instanceName"
        ></el-option>
      </el-select>
    </div>
    <el-tabs v-model="activeParameter" class="left-tabs" tab-position="left">
      <el-tab-pane v-for="({ label }, index) in equipmentConfigs" :key="index" :label="label" :name="`${index}`" />
    </el-tabs>
    <EdomsCharts :option="option" :width="width" :height="height"></EdomsCharts>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import EdomsCharts from '../../../EdomsCharts.vue';
import { ECOption } from '../../../types';
import { MEquipmentParameterConfig } from '../type';

interface EquipOptions {
  instanceName: string;
  instance: string;
}
const props = defineProps<{
  option: ECOption;
  width: number;
  height: number;
  parameterConfigs: MEquipmentParameterConfig[];
}>();

const emit = defineEmits<{
  (event: 'changeEquipmentConfig', value: Map<string, MEquipmentParameterConfig>): void;
}>();

const activeParameter = ref<string>('0');

const equipmentConfigs = ref<MEquipmentParameterConfig[]>([]);

const equipName = ref(props.parameterConfigs[0].instanceName);

const options = computed<EquipOptions[]>(() => {
  const opObj = new Map();
  const result: EquipOptions[] = [];
  props.parameterConfigs.forEach(({ instanceName, instance }) => {
    opObj.set(instanceName, instance);
  });
  opObj.forEach((item, key) => {
    result.push({
      instanceName: key,
      instance: item,
    });
  });
  return result;
});

const equipmentsConfigs = ref<Map<string, MEquipmentParameterConfig[]>>(new Map<string, MEquipmentParameterConfig[]>());

const activeIndicatorConfig = computed<Map<string, MEquipmentParameterConfig>>(() => {
  const result = new Map<string, MEquipmentParameterConfig>();
  if (!equipmentConfigs.value.length) {
    return result;
  }
  const activeConfig = equipmentConfigs.value[Number(activeParameter.value)];
  result.set(`${activeConfig.instance[activeConfig.instance.length - 1]}:${activeConfig.property}`, activeConfig);
  return result;
});

watch(
  () => props.parameterConfigs,
  (parameterConfig) => {
    const result = new Map<string, MEquipmentParameterConfig[]>();
    parameterConfig.forEach((item) => {
      if (result.has(item.instanceName)) {
        const tarInstance = result.get(item.instanceName) ?? [];
        tarInstance?.push(item);
        result.set(item.instanceName, tarInstance);
      } else {
        result.set(item.instanceName, [item]);
      }
    });
    equipmentsConfigs.value = result;
  },
  { immediate: true }
);

watch(
  () => equipName.value,
  () => {
    equipmentConfigs.value = equipmentsConfigs.value.get(equipName.value) ?? [];
    activeParameter.value = '0';
  },
  { immediate: true }
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
  display: flex;

  .select-box {
    position: absolute;
    right: 130px;
    width: 1.5rem;
  }
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
