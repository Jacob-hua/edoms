<template>
  <div>
    <div class="electric">
      <div class="wrap-icon">
        <img class="icon-report" src="../assets/icon2.png" alt="" @click="changeElectric" />
      </div>
    </div>
    <div v-if="showElectric" class="wrap-body">
      <div class="wrap-body-top">
        <img class="icon-left" src="../assets/icon.png" alt="" />
        <span class="elefont">电能质量</span>
      </div>
      <div class="wrap-body-bottom">
        <el-tabs type="border-card">
          <el-tab-pane class="tab">
            <template #label>
              <span class="custom-tabs-label">
                <span>三相不平衡</span>
              </span>
            </template>
            <!-- <PowerFactor></PowerFactor> -->
            <ThreePhaseUnbalance :config="config"></ThreePhaseUnbalance>
          </el-tab-pane>
          <el-tab-pane class="tab">
            <template #label>
              <span class="custom-tabs-label">
                <span>功率因素</span>
              </span>
            </template>
            <PowerFactor></PowerFactor>
            <!-- <ThreePhaseUnbalance></ThreePhaseUnbalance> -->
          </el-tab-pane>
          <el-tab-pane class="tab" label="电压分析">电压分析</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import PowerFactor from './component/PowerFactor.vue';
import ThreePhaseUnbalance from './component/ThreePhaseUnbalance.vue';
import { ElectricEnergyQuality } from './type';

defineProps<{
  config: ElectricEnergyQuality;
}>();

const showElectric = ref<boolean>(false);
const changeElectric = () => {
  showElectric.value = true;
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs--border-card > .el-tabs__header) {
  background-color: rgba(0, 0, 0, 1) !important;
  border-bottom: none;
}
:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  background-color: rgba(0, 42, 66, 1) !important;
  color: #ffffff;
  border: 1px solid #007bc0;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  width: 130px;
  height: 34px;
  background: rgba(0, 20, 31, 1);
  color: rgba(234, 245, 255, 1);
  border: 1px solid #007bc0;
  margin: 30px 20px 0px 30px;
  text-align: center;
  line-height: 34px;
}

:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}

:deep(.el-tabs__nav) {
  height: 65px;
}

.electric {
  min-width: 117px;
  min-height: 80px;
  background: rgba(0, 163, 255, 0.06);
  //   border: 1px solid #051823;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .wrap-icon {
    width: 60px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 114, 179, 0.4);
    border: 1px solid #0072b3;
    border-radius: 4px;
    .icon-report {
      width: 22px;
      height: 24px;
      cursor: pointer;
    }
  }
}
.wrap-body {
  width: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1800px;
  height: 840px;
  min-width: 822px;
  min-height: 364px;
  .wrap-body-top {
    width: 100%;
    height: 52px;
    background-color: rgba(7, 29, 56, 1);
    .icon-left {
      width: 23px;
      height: 23px;
      margin: 15px 15px 10px 14px;
    }
    .elefont {
      color: rgba(234, 245, 255, 1);
      font-size: 18px;
      margin-top: 20px;
    }
  }
  .wrap-body-bottom {
    width: 100%;
    height: 788px;
    background-color: rgba(0, 0, 0, 1);
    .el-tabs--border-card {
      background-color: rgba(0, 0, 0, 1);
    }
  }
}
</style>
