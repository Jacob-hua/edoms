<template>
  <div class="wrapper">
    <div v-for="({ style }, index) in lightConfigs" :key="index" :style="style" class="light"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import useApp from '../../useApp';

import { LightItem, MIndicatorLight } from './type';

const props = defineProps<{
  config: MIndicatorLight;
}>();

const { provideMethod } = useApp(props);

const lightValue = ref<number>(props.config.initValue);

const lightConfigs = computed<LightItem[]>(() =>
  (props.config.lights ?? []).map((item) => {
    let style = '';
    if (!lightValue.value) {
      return {
        ...item,
        style,
      };
    }

    if (lightValue.value <= item.maxValue && lightValue.value > item.minValue) {
      style = `background-color: ${item.color}`;
    }
    return {
      ...item,
      style,
    };
  })
);

const setValue = provideMethod(
  'setValue',
  ({ value }) => {
    lightValue.value = value;
  },
  ['value']
);

watch(
  () => props.config.initValue,
  (value) => setValue({ value }),
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wrapper {
  width: inherit;
  height: inherit;
  min-width: 20px;
  min-height: 20px;
  display: flex;
  justify-content: space-around;
  padding: 2px;
}
.light {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #333333;
  margin: 2px 2px;
}
</style>
