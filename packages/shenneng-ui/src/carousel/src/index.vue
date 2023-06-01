<template>
  <div class="carousel-wrapper">
    <div ref="slidesRef" class="slides">
      <div v-for="(src, index) in imgs" :key="index" class="slide">
        <img :src="src" />
      </div>
    </div>
    <div class="control-wrapper">
      <div
        v-for="(_, index) in imgs"
        :key="index"
        :class="{
          dot: true,
          active: index === activeImgIndex,
        }"
        @click="activeImgIndex = index"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

import { useApp } from '../../useApp';

import AltImg from './assets/alt.svg';
import { MCarousel } from './type';

const props = defineProps<{
  config: MCarousel;
}>();

const { provideMethod, app } = useApp(props);

const node = app?.page?.getNode(props.config.id);

const imgs = computed<string[]>(() => {
  if (app && props.config.imgs) {
    return props.config.imgs.map((item) => app.generateImageSrc(item));
  }
  return [AltImg];
});

const slidesRef = ref<HTMLElement>();

const activeImgIndex = ref<number>(0);

const slidesLeft = computed<number>(() =>
  slidesRef.value ? activeImgIndex.value * slidesRef.value.clientWidth * -1 : 0
);

watchEffect(() => {
  app?.emit('carousel:change', node, {
    activeIndex: activeImgIndex.value,
  });
});

const switchPre = provideMethod('switchPre', () => {
  if (activeImgIndex.value === 0) {
    return;
  }
  activeImgIndex.value -= 1;
});

const switchNext = provideMethod('switchNext', () => {
  if (activeImgIndex.value === imgs.value.length - 1) {
    return;
  }
  activeImgIndex.value += 1;
});

provideMethod('jumpTo', ({ num }) => {
  if (num > imgs.value.length - 1) {
    activeImgIndex.value = imgs.value.length - 1;
  } else if (num < 0) {
    activeImgIndex.value = 0;
  } else {
    activeImgIndex.value = num;
  }
});

defineExpose({
  switchPre,
  switchNext,
});
</script>

<style scoped lang="scss">
.carousel-wrapper {
  overflow: hidden;
}
.slides {
  width: 100%;
  height: 100%;
  position: relative;
  left: calc(v-bind(slidesLeft) * 1px);
  transition: left 1s ease-in-out;
  display: flex;
}
.slide {
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.control-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;

  & .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgb(59, 59, 59);
    opacity: 0.3;
    margin: 4px;
    cursor: pointer;
    transition: opacity 1s ease-in-out;
  }

  & .active {
    opacity: 1;
  }
}
</style>
