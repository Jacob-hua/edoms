<template>
  <div class="container">
    <div class="header-top">
      <span class="top-wrapper" @click="handleClose">
        <span class="header-back">＜</span>
        <span class="header-text">收起</span>
      </span>
    </div>
    <div class="parameter-wrapper">
      <div class="progress-box">
        <div v-for="(item, index) in data" :key="index" class="efficiency-row">
          <div class="efficiency-col">{{ item.energyName }}</div>
          <div class="efficiency-col efficiency-progress">
            <el-progress :stroke-width="24" :text-inside="true" :color="actureColor" :percentage="item.percentage">{{
              item.efficiencyNum
            }}</el-progress>
            <div class="target-line"></div>
          </div>
        </div>
      </div>
      <div class="wrap-footer">
        <div class="legend-acture">
          <div class="legend-acture-box"></div>
          <span class="legend-text">实际值</span>
        </div>
        <div class="legend-target">
          <div class="legend-target-box"></div>
          <span class="legend-text">目标值</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EnergyEfficiency } from '../type';

defineProps<{
  visible: boolean;
  data: EnergyEfficiency[];
  actureColor: string;
  targetColor: string;
}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const handleClose = () => {
  emit('update:visible', false);
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: fit-content;
  margin-left: 10px;
  background-color: #2c2c2c;
  color: #ffffff85;

  .header-top {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px 0 16px;

    .top-wrapper {
      cursor: pointer;
      color: #ffffff85;
      font-size: 16px;
    }
  }

  .parameter-wrapper {
    .progress-box {
      margin-top: 12px;
      max-height: 240px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .target-line {
      width: 2px;
      height: 30px;
      background: v-bind(targetColor);
      position: absolute;
      top: -2px;
    }

    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    .efficiency-row {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      box-sizing: border-box;
      width: 356px;
      margin: 8px 20px 8px 16px;
      align-items: center;
      justify-content: space-between;

      .efficiency-progress {
        width: 302px;
      }
    }

    :deep(.el-progress-bar__outer) {
      border-radius: 0;
      background-color: #ffffff45;

      .el-progress-bar__inner {
        border-radius: 0;
      }

      .el-progress-bar__innerText {
        color: #ffffff85;
      }
    }

    .wrap-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      margin-top: 8px;

      .legend-acture,
      .legend-target {
        display: flex;
        margin: 0 10px;
        align-items: center;
      }

      .legend-acture-box {
        width: 16px;
        height: 16px;
        background: v-bind(actureColor);
      }

      .legend-target-box {
        width: 2px;
        height: 16px;
        background: v-bind(targetColor);
      }

      .legend-text {
        margin-left: 8px;
      }
    }
  }
}
</style>
