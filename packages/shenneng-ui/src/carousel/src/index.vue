<template>
  <div class="slider">
    <div ref="slidesContainer" class="slides" @mousemove="handleMouseMove" @mouseleave="resetSlider">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="slide"
        :style="{ backgroundImage: `url(${slide})` }"
      ></div>
      <div class="indicators">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const slides = [
  'http://pic1.win4000.com/wallpaper/7/55f7dc5a2025a.jpg',
  'http://pic1.win4000.com/wallpaper/7/55f666fccf3c9.jpg',
  'http://pic1.win4000.com/wallpaper/7/55f666c9dd2f4.jpg',
];

const currentIndex = ref(0);
const slidesContainer = ref<HTMLElement>();

const handleMouseMove = (event: MouseEvent) => {
  if (!slidesContainer.value) {
    return;
  }
  const width = slidesContainer.value.offsetWidth;
  const x = event.pageX - slidesContainer.value.offsetLeft;
  const percentage = (x / width) * 100;
  currentIndex.value = Math.floor(percentage / (100 / slides.length));
};

const resetSlider = () => {
  currentIndex.value = 0;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

onMounted(() => {
  if (!slidesContainer.value) {
    return;
  }
  slidesContainer.value.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  if (!slidesContainer.value) {
    return;
  }
  slidesContainer.value.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.slider {
  position: relative;
}

.slides {
  display: flex;
  overflow: hidden;
}

.slide {
  flex: 0 0 100%;
  height: 100px;
  background-size: cover;
}

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
  margin: 5px;
  cursor: pointer;
}

.indicator.active {
  background-color: black;
}
</style>
