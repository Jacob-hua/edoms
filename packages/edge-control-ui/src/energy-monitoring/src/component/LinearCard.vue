<template>
  <div ref="colorCardRef" class="color-card-wrapper">
    <div class="color">
      <div
        v-for="index in bisectionNumber - 1"
        :key="index"
        :style="calculateDistance(index)"
        class="division-wrapper"
      ></div>
      <div class="gradient"></div>
      <div class="cursor-line" :style="cursorLinePositon.style">
        <span class="excellent-value">
          {{ transFixed(cursorLinePositon.value) || '5.0' }}
        </span>
      </div>
      <div class="cursor" :style="{ left: calculateCursorPosition }"></div>
    </div>
    <div class="value">
      <span class="min">{{ energyMonitoringMinNum }}</span>
      <span class="max">{{ energyMonitoringMaxNum }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { MEnergyMonitoring } from '../type';

interface StyleValue extends Record<string, any> {
  left: string;
}

const props = defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();

const bisectionNumber = computed<number>(() => (props.config.bisectionNumber ? props.config.bisectionNumber : 6));

const colorCardRef = ref<HTMLElement>();

const colorCardWidth = ref<number>(0);

const total = computed<number>(() => Number(props.config.maxValue) - Number(props.config.minValue));

const energyMonitoringMaxNum = computed<string>(() => transFixed(props.config.maxValue) || '6.0');

const energyMonitoringMinNum = computed<string>(() => transFixed(props.config.minValue) || '0.0');

const transFixed = (value: string) => {
  if (!value) return;
  return Number.isInteger(Number(value)) ? value + '.0' : value;
};

const cursorLinePositon = computed(() => {
  if (props.config.reference.length) {
    return {
      style: {
        left:
          (colorCardWidth.value * Number(props.config.reference?.[0].referenceValue || 5)) /
            Number(props.config.maxValue || 6) +
          'px',
        backgroundColor: props.config.reference[0].color || 'rgba(255, 255, 255,1)',
      },
      value: props.config.reference?.[0].referenceValue || 5,
    };
  } else {
    return {
      style: {
        left: '5px',
        backgroundColor: 'rgba(255, 255, 255,1)',
      },
      value: 5,
    };
  }
});

const getWidth = (pos: string): number => {
  let width = 33.3;
  if (isNaN(total.value) || total.value <= 0) return 33.3;
  const leftVal =
    props.config.medium.length > 0
      ? Number(props.config.medium[0].maxValue) - Number(props.config.medium[0].minValue) || 1
      : 1;
  const centerVal = 1;
  const rightVal =
    props.config.excellent.length > 0
      ? Number(props.config.excellent[0].maxValue) - Number(props.config.excellent[0].minValue) || 1
      : 1;

  const totalVal = leftVal + centerVal + rightVal;
  const leftWidth = leftVal / totalVal;
  const centerWidth = centerVal / totalVal;
  const rightWidth = rightVal / totalVal;
  switch (pos) {
    case 'left':
      width = leftWidth * 100;
      break;
    case 'center':
      width = centerWidth * 100;
      break;
    case 'right':
      width = rightWidth * 100;
      break;

    default:
      break;
  }
  return width;
};

const attributeGradient = computed(
  () =>
    `linear-gradient(to right, ${props.config.medium[0].color || 'rgba(231, 106, 47,1)'} 0%, ${
      props.config.medium[0].color || 'rgba(231, 106, 47,1)'
    } ${getWidth('left')}%,
    ${props.config.excellent[0].color || 'rgba(54, 167, 99,1)'} ${getWidth('left') + getWidth('center')}%)`
);

//每一块的宽度
const divideWidth = computed<any>(() => (colorCardWidth.value / bisectionNumber.value).toFixed(2));

// 监听html元素变化
const colorCardObserver = new ResizeObserver(() => {
  colorCardWidth.value = colorCardRef.value?.clientWidth ?? 0;
});

watch(
  () => props.actualValue,
  (newVal) => {
    calculateCursorPosition.value = calculatePosition(newVal) + 'px';
  }
);

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
    left: `${index * divideWidth.value}px`,
    width: `2px`,
  };
};

const calculatePosition = (inputValue: string | number): number => {
  const maxValue = props.config.maxValue ? props.config.maxValue : 6;
  if (Number(inputValue) > Number(maxValue)) {
    return colorCardWidth.value - divideWidth.value;
  }
  if (Number(inputValue) == Number(maxValue) && props.config.maxValue !== '') {
    return colorCardWidth.value - divideWidth.value;
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

const calculateCursorPosition = ref('0px');

const cursorAttribute = computed(() => `12px solid ${props.config.cursorColor}`);

const divideBackground = computed(() =>
  props.config.style && props.config.style.backgroundColor ? props.config.style.backgroundColor : 'rgba(26, 23, 23,1)'
);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: inherit;

  .color {
    position: relative;
    width: 100%;
    height: 20px;
    display: flex;
    .cursor {
      position: absolute;
      width: 0;
      height: 0;
      top: 15px;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid transparent;
      border-bottom: v-bind(cursorAttribute);
      left: v-bind(calculateCursorPosition);
      z-index: 2;
    }
    .gradient {
      width: 100%;
      height: 100%;
      background-image: v-bind(attributeGradient);
    }

    .cursor-line {
      position: absolute;
      width: 2px;
      height: 112%;
      top: -1px;

      .excellent-value {
        position: absolute;
        top: 110%;
        left: -8px;
        font-size: 16px;
        color: #fff;
      }
    }

    .division-wrapper {
      position: absolute;
      height: 100%;
      background-color: v-bind(divideBackground);
    }

    .division-wrapper::before {
      position: absolute;
      content: '';
      left: -6px;
      bottom: 0;
      width: 6px;
      height: 100%;
      border-radius: 0 0 6px 0;
    }

    .division-wrapper::after {
      position: absolute;
      height: 100%;
      content: '';
      right: -6px;
      bottom: 0;
      width: 6px;
      height: 100%;
      border-radius: 0 0 0 6px;
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
    top: 10px;
    .min,
    .max {
      font-size: 16px;
      color: #aeb0b3;
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
