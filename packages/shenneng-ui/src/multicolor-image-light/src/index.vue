<template>
  <div class="wrapper">
    <!-- <div :style="lightConfig?.style" class="light"></div> -->
    <!-- <span :style="lightConfig?.style">{{ lightConfig?.text }}</span> -->
    <img :src="imgSrc" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import useApp from '../../useApp';

import AltImg from './assets/alt.svg';
import { MLightItem, MMulticolorSingleLight } from './type';

const props = defineProps<{
  config: MMulticolorSingleLight;
}>();

const { provideMethod, app } = useApp(props);

const lightValue = ref<number>(props.config.initValue);

const imgSrc = computed(() => {
  const lightConfig: MLightItem | undefined = (props.config.lights ?? []).find(
    (item) => lightValue.value <= item.maxValue && lightValue.value > item.minValue
  );
  if (lightConfig) {
    return app?.generateImageSrc(lightConfig.src[0]);
  }

  return AltImg;
});

const setValue = provideMethod(
  'setValue',
  ({ value }) => {
    lightValue.value = +value;
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

  img {
    width: inherit;
  }
}
// .light {
//   width: 10px;
//   height: 10px;
//   border-radius: 50%;
//   background-color: #333333;
//   margin: 2px 2px;
// }
</style>
