<template>
  <div ref="colorCardRef" class="color-card-wrapper">
    <div class="color">
      <div
        v-for="index in config.bisectionNumber - 1"
        :key="index"
        :style="calculateDistance(index)"
        class="division-wrapper"
      ></div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
    <div class="value">
      <div class="cursor"></div>
      <span class="min">{{ config.minValue }}</span>
      <span class="max">{{ config.maxValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { MEnergyMonitoring } from '../type';

interface StyleValue extends Record<string, any> {
  left: string;
}

const props = defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();

const colorCardRef = ref<HTMLElement>();

const colorCardWidth = ref<number>(0);

const attributeLeft = computed<string>(
  () => `linear-gradient(90deg, ${props.config.medium[0].color}, ${props.config.good[0].color})`
);
const attributeRight = computed<string>(
  () => `linear-gradient(90deg, ${props.config.good[0].color}, ${props.config.excellent[0].color})`
);

const positionDistance = computed<number>(
  () => (colorCardWidth.value - (props.config.bisectionNumber - 1) * 15) / props.config.bisectionNumber
);
// 监听html元素变化
const colorCardObserver = new ResizeObserver(() => {
  colorCardWidth.value = colorCardRef.value?.clientWidth ?? 0;
});

onMounted(() => {
  if (!colorCardRef.value) {
    return;
  }
  colorCardWidth.value = colorCardRef.value.clientWidth;
  colorCardObserver.observe(colorCardRef.value);
});

onUnmounted(() => {
  if (!colorCardRef.value) {
    return;
  }
  colorCardObserver.unobserve(colorCardRef.value);
});

const calculateDistance = (index: number): StyleValue => {
  return {
    left: `${positionDistance.value * index + (index - 1) * 15}px`,
  };
};

const calculatePosition = (inputValue: string | number): number => {
  if (Number(inputValue) >= Number(props.config.maxValue)) {
    return colorCardWidth.value;
  }

  if (Number(inputValue) <= Number(props.config.minValue)) {
    return 0;
  }
  return (
    colorCardWidth.value *
    ((Number(inputValue) - Number(props.config.minValue)) /
      (Number(props.config.maxValue) - Number(props.config.minValue)))
  );
};

const calculateCursorPosition = computed(() => `${calculatePosition(props.actualValue)}px`);

const cursorAttribute = computed(() => `12px solid ${props.config.cursorColor}`);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .color {
    position: relative;
    width: 100%;
    height: 60%;
    display: flex;
    // background-color: green;
    .left {
      width: 50%;
      height: 100%;
      background-image: v-bind(attributeLeft);
    }
    .right {
      width: 50%;
      height: 100%;
      background-image: v-bind(attributeRight);
    }
    .division-wrapper {
      position: absolute;
      width: 15px;
      height: 100%;
      background-color: rgba(31, 30, 29, 1);
    }
  }
  .value {
    position: relative;
    font-size: 12px;
    color: #c4e5f8;
    width: 100%;
    height: 40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cursor {
      position: absolute;
      width: 0;
      height: 0;
      top: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid transparent;
      border-bottom: v-bind(cursorAttribute);
      left: v-bind(calculateCursorPosition);
      z-index: 2;
    }
    .min,
    .max {
      margin-top: 5%;
    }
  }

  .overflow-ellipsis {
    max-width: 76px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
