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
import { computed, ref } from 'vue';

const imgs = ref<string[]>([
  'https://img1.baidu.com/it/u=1525818566,3553142770&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
  'https://img0.baidu.com/it/u=2971860837,688680294&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
  'https://img2.baidu.com/it/u=897481939,1199174386&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313',
]);

const slidesRef = ref<HTMLElement>();

const activeImgIndex = ref<number>(0);

const slidesLeft = computed<number>(() =>
  slidesRef.value ? activeImgIndex.value * slidesRef.value.clientWidth * -1 : 0
);

const handlePreImg = () => {
  if (activeImgIndex.value === 0) {
    return;
  }
  activeImgIndex.value -= 1;
};

const handleNextImg = () => {
  if (activeImgIndex.value === imgs.value.length - 1) {
    return;
  }
  activeImgIndex.value += 1;
};

defineExpose({
  preImg: handlePreImg,
  nextImg: handleNextImg,
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
    object-fit: cover;
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
    background-color: rgb(139, 141, 141);
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
