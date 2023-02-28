<template>
  <div style="min-width: 392px; min-height: 160px">
    <BusinessCard title="系统运行参数" subtitle="SYSTEM OPERATING PARAMETERS" min-width="392" min-height="160">
      <template #operation>
        <div :class="operatable" @click="handleShowMore">...</div>
      </template>
      <div class="setting-wrapper">
        <div v-for="({ name, unit, value }, index) in parameterData" :key="index" class="parameter">
          <p class="value-wrapper">
            <span class="value overflow-ellipsis" :title="value">{{ value }}</span
            ><span class="unit">{{ unit }}</span>
          </p>
          <p class="label overflow-ellipsis">{{ name }}</p>
        </div>
      </div>
    </BusinessCard>
    <MoreParameters v-if="surplusParameterVisible" v-model:visible="surplusParameterVisible" :data="surplusParameter" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { MComponent } from '@edoms/schema';
import { formatPrecision, isNumber } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import MoreParameters from './component/MoreParameters.vue';
import apiFactory from './api';
import { Parameter } from './type';

interface MParameter {
  instance: string[];
  instanceType: string;
  name: string;
  precision: string;
  property: string;
  propertyType: string;
  value: string;
  unit: string;
}
interface MParameterConfig extends MComponent {
  visibleNumber: number;
  intervalDelay: number;
  parameters: MParameter[];
}
const props = defineProps<{
  config: MParameterConfig;
}>();

const parameterData = ref<Parameter[]>([]);
const surplusParameter = ref<Parameter[]>([]);
const surplusParameterVisible = ref<boolean>(false);
const { request } = useApp(props);
const { fetchParameterData } = apiFactory(request);

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 10;
  }
  return props.config.intervalDelay;
});

const operatable = computed(() => (surplusParameter.value.length ? 'operation' : 'dis-operation'));

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
      if (isNumber(dataValue)) {
        targetData.value = String(formatPrecision(Number(dataValue), targetData.precision));
      } else {
        targetData.value = dataValue;
      }
    });
  });
};

watch(
  () => props.config,
  async ({ parameters, visibleNumber }) => {
    if (!parameters) return;
    // visibleNumber 做分行显示用
    if (parameters.length > visibleNumber) {
      parameterData.value = parameters?.slice(0, visibleNumber);
      surplusParameter.value = parameters?.slice(visibleNumber);
    } else {
      parameterData.value = parameters;
      surplusParameter.value = [];
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
useIntervalAsync(updateParameters, intervalDelay.value);

const handleShowMore = () => {
  // 没有更多数据时无法点击
  surplusParameter.value?.length && (surplusParameterVisible.value = true);
};
</script>

<style lang="scss" scoped>
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.operation {
  font-size: 28px;
  cursor: pointer;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff85;
  text-align: center;
}

.dis-operation {
  font-size: 28px;
  position: relative;
  top: -10px;
  width: 20px;
  height: 20px;
  color: #ffffff45;
  text-align: center;
  cursor: default;
}

.setting-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-around;

  .parameter {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    margin-top: 32px;
    padding: 8px;

    .value-wrapper {
      margin-bottom: 4px;

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
</style>
