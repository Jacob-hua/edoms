<template>
  <div class="wrapper">
    <!-- <div :style="lightConfig?.style" class="light"></div> -->
    <span :style="lightConfig?.style">{{ lightConfig?.text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import useApp from '../../useApp';

import { LightItem, MMulticolorSingleLight } from './type';

const props = defineProps<{
  config: MMulticolorSingleLight;
}>();

const { provideMethod } = useApp(props);

const lightValue = ref<number>(props.config.initValue);

const lightConfig = computed<LightItem | undefined>(() => {
  const lightConfig: LightItem | undefined = (props.config.lights ?? []).find(
    (item) => lightValue.value <= item.maxValue && lightValue.value > item.minValue
  );
  if (lightConfig) {
    lightConfig.style = `color: ${lightConfig.color}`;
  }
  return lightConfig;
});

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
  min-width: 56px;
  min-height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
// .light {
//   width: 10px;
//   height: 10px;
//   border-radius: 50%;
//   background-color: #333333;
//   margin: 2px 2px;
// }
</style>
