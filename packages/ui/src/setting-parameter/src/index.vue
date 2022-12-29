<template>
  <div class="setting">
    <BusinessCard title="设定参数" subtitle="SETTING PARAMETERS" min-width="480" min-height="200">
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

import { MComponent } from '@edoms/schema';

import BusinessCard from '../../BusinessCard.vue';

import MoreParameters from './component/MoreParameters.vue';
import { Parameter } from './type';

interface MParameterConfig extends MComponent {
  visibleNumber: number;
  parameters: Parameter[];
}
const props = defineProps<{
  config: MParameterConfig;
}>();

const parameterData = ref<Parameter[]>();
const surplusParameter = ref<Parameter[]>();
const surplusParameterVisible = ref<boolean>(false);

watch(
  () => props.config,
  ({ parameters, visibleNumber }) => {
    parameterData.value = parameters?.slice(0, visibleNumber);
    surplusParameter.value = parameters?.slice(visibleNumber);
  },
  {
    immediate: true,
    deep: true,
  }
);
const handleShowMore = () => {
  // 没有更多数据时展开无法点击触发
  surplusParameter.value?.length && (surplusParameterVisible.value = true);
};
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  .open {
    font-size: 36px;
    cursor: pointer;
    position: relative;
    top: -14px;
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
