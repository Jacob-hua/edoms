<template>
  <div ref="colorCardRef" class="color-card-wrapper">
    <div
      v-for="index in config.bisectionNumber"
      :key="index"
      :style="calculateDistance(index)"
      class="division-wrapper"
    ></div>
    <div class="cursor"></div>
    <div class="reference-line-wrapper">
      <div class="reference-value overflow-ellipsis" :title="config.referenceValue">{{ config.referenceValue }}</div>
    </div>
    <div class="min-value overflow-ellipsis" :title="config.minValue">{{ config.minValue }}</div>
    <div class="max-value overflow-ellipsis" :title="config.maxValue">{{ config.maxValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { MEfficiencyMonitoring } from '../type';

interface StyleValue extends Record<string, any> {
  left: string;
}

const props = defineProps<{
  config: MEfficiencyMonitoring;
  actualValue: number;
}>();

const colorCardRef = ref<HTMLElement>();

const colorCardWidth = ref<number>(0);

const attribute = computed<string>(
  () => `linear-gradient(90deg, ${props.config.startColor}, ${props.config.endColor})`
);

const positionDistance = computed<number>(() => colorCardWidth.value / props.config.bisectionNumber);

const referenceLineColor = computed<string>(() => props.config.referenceLineColor);

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
    left: `${positionDistance.value * index}px`,
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

const calculateCursorPosition = computed(() => `${calculatePosition(props.actualValue) - 8}px`);

const calculateReferencePosition = computed(() => `${calculatePosition(props.config.referenceValue)}px`);

const cursorAttribute = computed(() => `12px solid ${props.config.cursorColor}`);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  height: 20px;
  background-image: v-bind(attribute);
  position: relative;

  .overflow-ellipsis {
    width: 76px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .division-wrapper {
    width: 2px;
    height: 20px;
    position: absolute;
    background-color: #000;
  }
  .reference-line-wrapper {
    width: 2px;
    height: 24px;
    position: absolute;
    top: -2px;
    left: v-bind(calculateReferencePosition);
    background-color: v-bind(referenceLineColor);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .reference-value {
      color: v-bind(referenceLineColor);
      position: absolute;
      bottom: -18px;
    }
  }
  .cursor {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid transparent;
    border-bottom: v-bind(cursorAttribute);
    position: absolute;
    bottom: -15px;
    left: v-bind(calculateCursorPosition);
    z-index: 2;
  }
  .min-value {
    color: #ffffff65;
    position: absolute;
    left: -5px;
    bottom: -20px;
  }
  .max-value {
    color: #ffffff65;
    position: absolute;
    right: -5px;
    bottom: -20px;
  }
}
</style>
