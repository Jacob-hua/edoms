<template>
  <div class="electric-con" @click="changeElectric($event, true)">
    <div class="electric">
      <div class="wrap-icon">
        <img class="icon-report" src="../assets/icon2.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <div v-if="showElectric" class="wrap-dialog">
      <div class="wrap-body">
        <div class="wrap-body-top">
          <div style="margin: 15px; display: flex">
            <img class="icon-left" src="../assets/icon.png" alt="" />
            <span class="elefont">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="changeElectric($event, false)"></div>
        </div>
        <div class="wrap-body-bottom">
          <el-tabs type="border-card">
            <el-tab-pane class="tab">
              <template #label>
                <span class="custom-tabs-label">
                  <span>{{ t('三相不平衡') }}</span>
                </span>
              </template>
              <ThreePhaseUnbalance :config="config"></ThreePhaseUnbalance>
            </el-tab-pane>
            <el-tab-pane class="tab">
              <template #label>
                <span class="custom-tabs-label">
                  <span>{{ t('功率因数') }}</span>
                </span>
              </template>
              <PowerFactor :config="config"></PowerFactor>
            </el-tab-pane>
            <el-tab-pane class="tab">
              <template #label>
                <span class="custom-tabs-label">
                  <span>{{ t('电压分析') }}</span>
                </span>
              </template>
              <VoltagAnalysis :config="config"></VoltagAnalysis>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useApp from '../../useApp';

import PowerFactor from './component/PowerFactor.vue';
import ThreePhaseUnbalance from './component/ThreePhaseUnbalance.vue';
import VoltagAnalysis from './component/VoltagAnalysis.vue';
import locales from './locales';
import { ElectricEnergyQuality } from './type';

const props = defineProps<{
  config: ElectricEnergyQuality;
}>();

const { setMessage, t } = useApp(props);

setMessage(locales);

const showElectric = ref<boolean>(false);
const changeElectric = (e: any, val: boolean) => {
  e.stopPropagation();
  showElectric.value = val;
};
</script>

<style lang="scss" scoped>
:deep(.el-tabs--border-card > .el-tabs__header) {
  background-color: rgba(0, 0, 0, 1) !important;
  border-bottom: none;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  background-color: rgba(0, 163, 255, 0.26) !important;
  color: #ffffff;
  border: 1px solid #007bc0;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  min-width: 130px;
  height: 34px;
  background: #00141f;
  color: #8f9aa3;
  margin: 30px 20px 0px 30px;
  text-align: center;
  line-height: 34px;
}

:deep(.el-tabs--border-card) {
  border: none;
}

:deep(.el-tabs--border-card > .el-tabs__content) {
  padding: 0;
}

:deep(.el-tabs__nav) {
  height: 65px;
}

.electric-con {
  min-width: 117px;
  min-height: 80px;
  position: relative;
  cursor: pointer;

  .electric {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .wrap-icon {
      width: 60px;
      height: 42px;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
      box-sizing: border-box;

      .icon-report {
        width: 22px;
        height: 24px;
      }
    }

    .label {
      margin-top: 7px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
  }
}

.wrap-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .wrap-body {
    background: #000;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 1800px;
    min-height: 840px;
    border: 1px solid #013460;
    display: flex;
    flex-direction: column;

    .wrap-body-top {
      width: 100%;
      height: 52px;
      background-image: url('../assets/title-bg.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;

      .icon-left {
        width: 23px;
        height: 23px;
        margin-right: 15px;
      }

      .elefont {
        color: rgba(234, 245, 255, 1);
        font-size: 18px;
      }

      .right-close {
        width: 24px;
        height: 24px;
        background-image: url('../assets/title-close.png');
        background-size: 14px 14px;
        background-position: center center;
        background-repeat: no-repeat;
        margin-top: 14px;
        margin-right: 30px;
        cursor: pointer;
      }
    }

    .wrap-body-bottom {
      width: 100%;
      flex: 1;
      background-color: rgba(0, 0, 0, 1);
      overflow: hidden;

      .el-tabs--border-card {
        background-color: rgba(0, 0, 0, 1);
      }
    }
  }
}
</style>
