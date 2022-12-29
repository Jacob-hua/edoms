<template>
  <div class="color-card-wrapper">
    <div v-for="index in bisectionNumber" :key="index" :style="calculateDistance(index)" class="division-wrapper"></div>
    <div class="triangle"></div>
    <div class="reference-line-wrapper">
      <div class="reference-value">{{ referenceValue }}</div>
    </div>
    <div class="start-value">{{ minValue }}</div>
    <div class="end-value">{{ maxValue }}</div>
  </div>
  <div class="legend-wrapper">
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
</template>

<script lang="ts" setup>
import { computed } from 'vue';
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
    referenceValue: string;
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
    referenceLineColor?: string;
  }>(),
  {
    bisectionNumber: () => 5,
    cursorColor: () => 'green',
    referenceLineColor: () => '#fff',
  }
);
const colorCardWidth: number = 360;

const attribute = computed(() => `linear-gradient(90deg, ${props.startColor}, ${props.endColor})`);

const positionDistance = computed(() => colorCardWidth / (props.bisectionNumber + 1));

const calculateDistance = (index: number): Position => {
  return {
    left: `${positionDistance.value * index}px`,
  };
};

const calculatePosition = (inputValue: string | number): Position => {
  return {
    left: `${
      colorCardWidth *
      ((Number(inputValue) - Number(props.minValue)) / (Number(props.maxValue) - Number(props.minValue)))
    }`,
  };
};
const calculateActualValuePosition = computed(() => `${+calculatePosition(props.actualValue)?.left - 8}px`);

const calculateReferenceValuePosition = computed(() => `${calculatePosition(props.referenceValue)?.left}px`);

const cursorAttribute = computed(() => `16px solid ${props.cursorColor}`);
</script>

<style lang="scss" scoped>
.color-card-wrapper {
  width: 360px;
  height: 30px;
  background-image: v-bind(attribute);
  position: relative;
  .division-wrapper {
    width: 2px;
    height: 30px;
    position: absolute;
    background-color: #000;
  }
  .reference-line-wrapper {
    width: 2px;
    height: 34px;
    position: absolute;
    top: -2px;
    left: v-bind(calculateReferenceValuePosition);
    background-color: v-bind(referenceLineColor);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .reference-value {
      color: v-bind(referenceLineColor);
      position: absolute;
      bottom: -20px;
    }
  }
  .triangle {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: v-bind(cursorAttribute);
    position: absolute;
    bottom: -16px;
    left: v-bind(calculateActualValuePosition);
    z-index: 2;
  }
  .start-value {
    color: #fff;
    position: absolute;
    left: 0;
    bottom: -20px;
  }
  .end-value {
    color: #fff;
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}
.legend-wrapper {
  width: 240px;
  margin-top: 40px !important;
  padding-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-left: 60px;
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
      background-color: v-bind(referenceLineColor);
    }
    margin-left: 20px;
  }
  span {
    color: #fff;
    margin-left: 15px;
  }
}
</style>
