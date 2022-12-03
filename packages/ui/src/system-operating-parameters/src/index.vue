<template>
  <div class="setting">
    <BusinessCard title="系统运行参数" subtitle="SYSTEM OPERATING PARAMETERS" min-width="480" min-height="200">
      <template #operation><span class="open" @click="handleShowMore">...</span></template>
      <div class="setting-wrapper">
        <div v-for="({ label, unit, value }, index) in parameterData" :key="index" class="parameter">
          <p class="value-wrapper">
            <span class="value">{{ value }}</span
            ><span class="unit">{{ unit }}</span>
          </p>
          <p class="label">{{ label }}</p>
        </div>
      </div>
    </BusinessCard>
    <MoreParameters v-if="surplusParameterVisible" v-model:visible="surplusParameterVisible" :data="surplusParameter" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import MoreParameters from './component/MoreParameters.vue';
import api from './api';
import { Parameter } from './type';

interface MParameter {
  instance: string[];
  instanceType: string;
  label: string;
  precision: string;
  property: string;
  propertyType: string;
  value: string;
  unit: string;
}
interface MParameterConfig {
  visibleNumber: number;
  intervalDelay: number;
  parameters: MParameter[];
}
const props = defineProps<{
  config: MParameterConfig;
}>();

const parameterData = ref<Parameter[]>();
const surplusParameter = ref<Parameter[]>();
const surplusParameterVisible = ref<boolean>(false);
const { request } = useApp(props);
const { fetchParameterData } = api(request);

const makeParameterList = (parameters: MParameter[]) => {
  const dataList = parameters?.map(({ instance, property }) => {
    return {
      deviceCode: instance.at(-1)!,
      propCodeList: [property],
    };
  });
  return {
    dataList,
  };
};

const updateParameters = async () => {
  const result = await fetchParameterData(makeParameterList(props.config.parameters));
  result.forEach(({ dataValue, deviceCode, propCode }) => {
    // 找到所有 设备code 匹配的参数项
    const target = props.config?.parameters?.filter(
      ({ instance, property }) => instance.at(-1) === deviceCode && property === propCode
    );
    if (!target.length) {
      return;
    }
    target?.forEach((targetData) => {
      targetData.value = String(formatPrecision(dataValue, targetData.precision));
    });
  });
};

watch(
  () => props.config,
  async ({ parameters, visibleNumber }) => {
    // visibleNumber 做分行显示用
    parameterData.value = parameters?.slice(0, visibleNumber);
    surplusParameter.value = parameters?.slice(visibleNumber);
  },
  {
    immediate: true,
    deep: true,
  }
);
useIntervalAsync(updateParameters, props.config.intervalDelay);

const handleShowMore = () => {
  // 没有更多数据时无法点击
  surplusParameter.value?.length && (surplusParameterVisible.value = true);
};
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  .open {
    font-size: 36px;
    cursor: pointer;
  }
  .setting-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .parameter {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 20%;
      .value-wrapper {
        margin-bottom: 8px;
        .value {
          font-weight: 500;
          font-size: 18px;
          color: lawngreen;
          margin-right: 8px;
        }
      }
      .label {
        margin: 0;
        padding: 0;
        width: 80px;
        font-size: 16px;
        text-align: center;
        height: 60px;
      }
    }
  }
}
</style>
