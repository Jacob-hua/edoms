<template>
  <div ref="colorCardRef" class="color-card-wrapper">
    <div v-for="index in bisectionNumber" :key="index" :style="calculateDistance(index)" class="division-wrapper"></div>
    <div class="triangle"></div>
    <div class="reference-line-wrapper">
      <div class="reference-value">{{ refrenceValue }}</div>
    </div>
    <div class="start-value">{{ minValue }}</div>
    <div class="end-value">{{ maxValue }}</div>
  </div>
  <div class="legend-wrapper">
    <div class="legend">
      <div class="legend-start">
        <div class="legend-box"></div>
        <span class="legend-text">较差</span>
      </div>
      <div class="legend-end">
        <div class="legend-box"></div>
        <span class="legend-text">优秀</span>
      </div>
      <div class="legend-reference">
        <div class="legend-box"></div>
        <span class="legend-text">参考值</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

interface Position {
  left: string;
}

const props = withDefaults(
  defineProps<{
    /** 最小值 **/
    minValue: string;
    /** 最大值 **/
    maxValue: string;
    /** 参考值  **/
    refrenceValue: string;
    /** 实际值  **/
    actualValue: string;
    /** 等分数量 **/
    bisectionNumber?: number;
    /** 开始颜色 **/
    startColor: string;
    /** 结束颜色 **/
    endColor: string;
    /** 游标颜色 **/
    cursorColor?: string;
    /** 参考线 颜色 **/
    refrenceLineColor?: string;
  }>(),
  {
    bisectionNumber: () => 5,
    cursorColor: () => 'green',
    refrenceLineColor: () => '#fff',
  }
);

const colorCardRef = ref<HTMLElement>();

const colorCardWidth = computed<number>(() => {
  if (!colorCardRef.value) {
    return 0;
  }
  return colorCardRef.value.clientWidth;
});

const attribute = computed(() => `linear-gradient(90deg, ${props.startColor}, ${props.endColor})`);

const positionDistance = computed(() => colorCardWidth.value / (props.bisectionNumber + 1));

const calculateDistance = (index: number): Position => {
  return {
    left: `${positionDistance.value * index}px`,
  };
};

const calculatePosition = (inputValue: string | number, colorCardWidth: number): Position => {
  if (Number(inputValue) >= Number(props.maxValue)) {
    return {
      left: `${colorCardWidth}`,
    };
  }

  if (Number(inputValue) <= Number(props.minValue)) {
    return {
      left: `${0}`,
    };
  }

  return {
    left: `${
      colorCardWidth *
      ((Number(inputValue) - Number(props.minValue)) / (Number(props.maxValue) - Number(props.minValue)))
    }`,
  };
};
const calculateActualValuePosition = computed(
  () => `${+calculatePosition(props.actualValue, colorCardWidth.value)?.left - 8}px`
);

const calculateReferenceValuePosition = computed(
  () => `${calculatePosition(props.refrenceValue, colorCardWidth.value)?.left}px`
);

const cursorAttribute = computed(() => `12px solid ${props.cursorColor}`);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  height: 20px;
  background-image: v-bind(attribute);
  position: relative;
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
    left: v-bind(calculateReferenceValuePosition);
    background-color: v-bind(refrenceLineColor);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .reference-value {
      color: v-bind(refrenceLineColor);
      position: absolute;
      bottom: -20px;
    }
  }
  .triangle {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid transparent;
    border-bottom: v-bind(cursorAttribute);
    position: absolute;
    bottom: -15px;
    left: v-bind(calculateActualValuePosition);
    z-index: 2;
  }
  .start-value {
    color: #ffffff65;
    position: absolute;
    left: -5px;
    bottom: -20px;
  }
  .end-value {
    color: #ffffff65;
    position: absolute;
    right: -5px;
    bottom: -20px;
  }
}
.legend-wrapper {
  margin-top: 40px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  .legend {
    display: flex;
  }
  .legend-start {
    width: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .legend-box {
      width: 16px;
      height: 16px;
      background-color: v-bind(startColor);
    }
    margin-left: 20px;
  }
  .legend-end {
    width: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .legend-box {
      width: 16px;
      height: 16px;
      background-color: v-bind(endColor);
    }
    margin-left: 20px;
  }
  .legend-reference {
    width: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .legend-box {
      width: 2px;
      height: 20px;
      background-color: v-bind(refrenceLineColor);
    }
    margin-left: 20px;
  }
  span {
    color: #ffffff65;
    margin-left: 8px;
  }
}
</style>
