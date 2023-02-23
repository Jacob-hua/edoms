<template>
  <BusinessCard min-width="392" min-height="240" title="设备运行参数" subtitle="EQUIPMENT OPERATING PARAMETER">
    <div class="wrapper">
      <el-tabs v-model="activeName" class="type-tabs">
        <el-tab-pane
          v-for="({ label }, index) in equipmentTypes"
          :key="index"
          :label="label"
          :name="index"
        ></el-tab-pane>
      </el-tabs>
      <div class="equipment-list">
        <div class="caret-left btn" @click="leftSlid"></div>
        <div ref="scrollRef" class="scroll-wrapper">
          <div class="list-box">
            <div v-for="(item, index) in equipments" :key="index" class="item" @click="handleChangeEquipment(index)">
              <span class="overflow-ellipsis" :class="{ 'active-equipment': activeEquipment === index }"
                >设备{{ item.label }}</span
              >
            </div>
          </div>
        </div>
        <div class="caret-right btn" @click="rightSlid"></div>
      </div>
      <div class="parameter-content">
        <div v-for="({ dataValue, label, unit }, index) in currentParameters" :key="index" class="parameter-item">
          <div class="value-wrapper">
            <span class="value overflow-ellipsis" :title="dataValue">{{ dataValue }}</span
            ><span class="unit">{{ unit }}</span>
          </div>
          <div class="label overflow-ellipsis">{{ label }}</div>
        </div>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import apiFactory from './api';
import { MParamenterConfig, MParameter } from './type';

interface Parameter extends MParameter {
  dataValue: string;
}

const props = defineProps<{
  config: MParamenterConfig;
}>();

const { request } = useApp(props);

const { fetchOperationParameter } = apiFactory(request);

const activeName = ref(0);
const scrollRef = ref();
const activeEquipment = ref(0);
const currentParameters = ref<Parameter[]>([]);

const equipmentTypes = computed(() => props.config.equipmentTypes ?? []);
const equipments = computed(() => {
  if (equipmentTypes.value.length) {
    return equipmentTypes.value[activeName.value].equipments ?? [];
  }
  return [];
});
const parameters = computed(() => {
  if (equipments.value.length) {
    return equipments.value[activeEquipment.value].parameters ?? [];
  }
  return [];
});
const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});
const params = computed(() => {
  const instance = equipments.value[activeEquipment.value]?.instance ?? '';
  return {
    dataList: [
      {
        deviceCode: instance[instance.length - 1],
        propCodeList: parameters.value.map(({ property }) => property),
      },
    ],
  };
});
const scrollWidth = computed(() => equipments.value.length * 64);
const leftBtnColor = computed(() => {
  if (scrollRef.value.scrollLeft <= 0) {
    return '#ffffff25';
  }
  return '#ffffff85';
});

const updateParameterData = async () => {
  const result = await fetchOperationParameter(params.value);
  currentParameters.value = parameters.value.map((parameter) => {
    let dataValue = '';
    const parameterVal = result.find(({ propCode }) => propCode === parameter.property);
    if (parameterVal && parameterVal.dataValue) {
      dataValue = String(formatPrecision(Number(parameterVal?.dataValue), parameter.precision));
    }
    return { ...parameter, dataValue };
  });
};

const rightBtnColor = computed(() => {
  if (scrollRef.value.clientWidth + scrollRef.value.scrollLeft >= scrollWidth.value) {
    return '#ffffff25';
  }
  return '#ffffff85';
});
const leftSlid = () => {
  if (scrollRef.value.scrollLeft <= 0) return;
  scrollRef.value.scrollLeft -= 64;
};

const rightSlid = () => {
  const clientWidth = scrollRef.value.clientWidth;
  if (scrollRef.value.scrollLeft + clientWidth >= scrollWidth.value) return;
  scrollRef.value.scrollLeft += 64;
};

const handleChangeEquipment = (index: number) => {
  activeEquipment.value = index;
};

const { flush } = useIntervalAsync(updateParameterData, intervalDelay.value);

watch(
  () => activeName.value,
  () => (activeEquipment.value = 0)
);

watch(
  () => parameters.value,
  () => {
    flush();
  }
);
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 12px 16px 0 16px;

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :deep(.el-tabs__header) {
    margin: 0;
    width: 360px;

    .el-tabs__nav-wrap::after {
      background-color: #ffffff25;
    }

    .is-scrollable {
      .el-tabs__item {
        width: 80px;
      }
    }
    .el-tabs__item {
      width: 90px;
      text-align: center;
      color: #ffffff45;
    }

    .el-tabs__active-bar {
      background-color: #e99a3c;
    }

    .is-active {
      color: #e99a3c;
    }
  }

  .equipment-list {
    width: 360px;
    height: 24px;
    display: flex;
    align-items: center;
    background: #ffffff08;
    margin-top: 10px;

    .btn {
      height: 0;
      width: 0;
      cursor: pointer;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
    .caret-left {
      border-left: 10px solid transparent;
      border-right: 10px solid;
      border-right-color: v-bind(leftBtnColor);
    }

    .scroll-wrapper {
      width: 320px;
      overflow: hidden;

      .list-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          width: 64px;
          height: 24px;
          color: rgba(255, 255, 255, 0.2705882353);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
        }

        .active-equipment {
          color: #e99a3c;
        }
      }
    }

    .caret-right {
      border-right: 10px solid transparent;
      border-left: 10px solid;
      border-left-color: v-bind(rightBtnColor);
    }
  }

  .parameter-content {
    display: flex;
    flex-wrap: wrap;

    .parameter-item {
      padding: 8px;
      width: 33.3%;
      box-sizing: border-box;
      margin-top: 8px;
      .value-wrapper {
        margin-bottom: 4px;
        text-align: center;
        display: flex;
        flex-wrap: nowrap;
        .value {
          width: 65%;
          display: inline-block;
          font-size: 16px;
          color: #00ff00;
          margin-right: 8px;
        }
      }

      .label {
        text-align: center;
      }
    }
  }
}

:deep(.business-wrapper-body) {
  align-items: flex-start;
}
</style>
