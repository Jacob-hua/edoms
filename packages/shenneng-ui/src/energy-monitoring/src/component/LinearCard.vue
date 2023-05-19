<template>
  <div ref="colorCardRef" class="color-card-wrapper">
    <div class="color">
      <div
        v-for="index in bisectionNumber - 1"
        :key="index"
        :style="calculateDistance(index)"
        class="division-wrapper"
      ></div>
      <div class="left" :style="`width:${getWidth('left')}`"></div>
      <div class="center" :style="`width:${getWidth('center')}`"></div>
      <div class="right" :style="`width:${getWidth('right')}`"></div>
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

const bisectionNumber = computed<number>(() => (props.config.bisectionNumber ? props.config.bisectionNumber : 11));

const colorCardRef = ref<HTMLElement>();

const colorCardWidth = ref<number>(0);

const total = computed<number>(() => Number(props.config.maxValue) - Number(props.config.minValue));

const getWidth = (pos: string) => {
  let width = '33.3%';
  if (isNaN(total.value) || total.value <= 0) return '33.3%';
  const leftVal =
    props.config.medium.length > 0
      ? Number(props.config.medium[0].maxValue) - Number(props.config.medium[0].minValue)
      : 1;
  const centerVal =
    props.config.good.length > 0 ? Number(props.config.good[0].maxValue) - Number(props.config.good[0].minValue) : 1;
  const rightVal =
    props.config.excellent.length > 0
      ? Number(props.config.excellent[0].maxValue) - Number(props.config.excellent[0].minValue)
      : 1;

  const totalVal = leftVal + centerVal + rightVal;

  const leftWidth = leftVal / totalVal;
  const centerWidth = centerVal / totalVal;
  const rightWidth = rightVal / totalVal;
  switch (pos) {
    case 'left':
      width = leftWidth * 100 + '%';
      break;
    case 'center':
      width = centerWidth * 100 + '%';
      break;
    case 'right':
      width = rightWidth * 100 + '%';
      break;

    default:
      break;
  }
  return width;
};

const getColor = (arrcolor: any) => {
  if (!arrcolor || arrcolor.length === 0 || arrcolor[0].color == '') return '';
  const arr = arrcolor[0].color.split(',');
  arr[arr.length - 1] = arr[arr.length - 1].replace('1', '0.3');
  console.log(arr.join(','));
  return arr.join(',');
};

const attributeLeft = computed<string>(
  () =>
    `linear-gradient(90deg, ${
      (props.config.medium && props.config.medium.length > 0 && props.config.medium[0].color) || 'rgba(231, 106, 47,1)'
    }, ${getColor(props.config.medium) || 'rgba(231, 106, 47,0.3)'})`
);
const attributeCenter = computed<string>(
  () =>
    `linear-gradient(90deg, ${
      (props.config.medium && props.config.good.length > 0 && props.config.good[0].color) || 'rgba(147, 135, 72,1)'
    }, ${getColor(props.config.good) || 'rgba(147, 135, 72,0.3)'})`
);
const attributeRight = computed<string>(
  () =>
    `linear-gradient(90deg, ${getColor(props.config.excellent) || 'rgba(54, 167, 99,0.3)'}, ${
      (props.config.medium && props.config.excellent.length > 0 && props.config.excellent[0].color) ||
      'rgba(54, 167, 99,1)'
    })`
);

const divideWidth = computed<any>(() => (colorCardWidth.value / (bisectionNumber.value * 2)).toFixed(2));

const positionDistance = computed<number>(
  //     const totalWidth = colorCardWidth.value;
  //   const divideWidth: any = (totalWidth / (bisectionNumber.value * 2)).toFixed(2);
  () => (colorCardWidth.value - (bisectionNumber.value - 1) * divideWidth.value) / bisectionNumber.value
);
// 监听html元素变化
const colorCardObserver = new ResizeObserver(() => {
  colorCardWidth.value = colorCardRef.value?.clientWidth ?? 0;
});

onMounted(() => {
  console.log(22222, props.config);
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
  //   const totalWidth = colorCardWidth.value;
  //   const divideWidth: any = (totalWidth / (bisectionNumber.value * 2)).toFixed(2);
  return {
    left: `${positionDistance.value * index + (index - 1) * divideWidth.value}px`,
    width: `${divideWidth.value}px`,
  };
};

// const calculateWidth = (): Record<string, any> => {
//   return {
//     width: '50%',
//   };
// };

const calculatePosition = (inputValue: string | number): number => {
  if (Number(inputValue) >= Number(props.config.maxValue)) {
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

const calculateCursorPosition = computed(() => `${calculatePosition(props.actualValue)}px`);

const cursorAttribute = computed(() => `12px solid ${props.config.cursorColor}`);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: inherit;
  .color {
    position: relative;
    width: 100%;
    height: 60%;
    display: flex;
    // background-color: green;
    .left {
      //   width: 50%;
      height: 100%;
      background-image: v-bind(attributeLeft);
    }
    .center {
      height: 100%;
      background-image: v-bind(attributeCenter);
    }
    .right {
      //   width: 50%;
      height: 100%;
      background-image: v-bind(attributeRight);
    }
    .division-wrapper {
      position: absolute;
      //   width: 15px;
      height: 100%;
      background-color: black;
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
