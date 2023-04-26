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
  (event: 'changeEquipmentConfig', value: Map<string, MIndicatorItemConfig>): void;
}>();
const activeTab = ref<number>(0);
const changeTab = (index: number) => {
  if (activeTab.value === index) return;
  activeTab.value = index;
};

// const activeParameter = ref<string>('0');

// const equipmentConfigs = ref<MIndicatorItemConfig[]>([]);

// const equipIndex = ref<string>('0');

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
  height: calc(100% - 31px);
  display: flex;
  //   padding: 12px 0px;
  box-sizing: border-box;
  //   background-color: red;
  //   width: 100%;
  .left-tab {
    min-width: 110px;
    height: 95%;
    width: 13.4%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    .button-tab {
      width: calc(100% - 10px);
      height: 24px;
      //   background-color: red;
      margin-top: 20px;
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
