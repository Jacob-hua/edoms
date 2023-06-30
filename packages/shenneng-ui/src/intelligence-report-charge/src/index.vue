<template>
  <div class="operations-analysis-pv" @click="handlerToShow($event, true)">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/outer-bg.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>

    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>

        <div class="content-data">
          <div class="frist-tab">
            <el-tabs v-model="activeNameF" class="tab demo-tabs" type="card" @tab-click="handleClickF">
              <el-tab-pane :label="t('运行报告')" name="power-qua"></el-tab-pane>
              <el-tab-pane :label="t('经营报告')" name="power-gen"></el-tab-pane>
              <el-tab-pane :label="t('设备报告')" name="power-equ"></el-tab-pane>
            </el-tabs>
          </div>

          <div class="select-gro">
            <div v-show="activeNameF === 'power-qua' ? true : false" class="dataTotal">
              <RunReport />
            </div>

            <div v-show="activeNameF === 'power-gen' ? true : false" class="dataTotal">
              <OperationReport />
            </div>

            <div v-show="activeNameF === 'power-equ' ? true : false" class="dataTotal">
              <EquipReport />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useApp from '../../useApp';

import EquipReport from './components/EquipReport.vue';
import OperationReport from './components/OperationReport.vue';
import RunReport from './components/RunReport.vue';
import locales from './locales';
import { OperationsAnalysisPv } from './type';

const props = defineProps<{
  config: OperationsAnalysisPv;
}>();

const { setMessage, t } = useApp(props);

setMessage(locales);

const isShowModel = ref<boolean>(false);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
const timeType = ref<string>('date');
const activeNameF = ref('power-qua');
const activeNameS = ref('day');

// 切换发电量/功率
const handleClickF = (event: any) => {
  if (activeNameF.value === event.paneName) {
    return;
  }
  activeNameF.value = event.paneName;
  // 默认展示日
  activeNameS.value = 'day';
  getData(activeNameS.value);
};

// 获取charts数据
const getData = (symbol: string) => {
  if (activeNameF.value === 'power-gen') {
    if (symbol === 'day') {
      timeType.value = 'date';
    } else {
      timeType.value = 'month';
    }
  } else if (symbol === 'day') {
    timeType.value = 'date';
  } else if (symbol === 'month') {
    timeType.value = 'month';
  } else {
    timeType.value = 'year';
  }
};
</script>

<style lang="scss" scoped>
:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item) {
  padding: 0 !important;
  min-width: 124px;
  height: 32px;
  margin-right: 30px;
  color: #eaf5ff;
  text-align: center;
  line-height: 32px;
  background: #00111a;
  border: none;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    right: -16px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background-color: #00a3ff;
    opacity: 0.4;
  }

  &:last-child::before {
    content: none;
  }
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: none;
  border-left: none;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  background: #00283f;
  border: 1px solid #007bc0;
  color: #ffffff;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: none;
}

:deep(.frist-tab > .el-tabs--card > .el-tabs__header) {
  margin: 0;
  border: none;
}

:deep(.second-tab > .el-tabs--card > .el-tabs__header .el-tabs__nav) {
  line-height: 80px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #4d505f;
}

:deep(.second-tab > .el-tabs--card > .el-tabs__header) {
  margin: 0px;
}

// :deep(.second-tab > .el-tabs__nav-wrap::after) {
//   content: none;
// }

:deep(.el-tabs__active-bar) {
  background: #00a3ff;
}

:deep(.el-tabs__item) {
  color: #eaf5ff;
}

:deep(.el-select) {
  width: 218px;
  height: 36px;
  margin-right: 20px;
}

:deep(.el-input__wrapper) {
  background: #010101;
  border: 1px solid #454e72;
  border-radius: 4px;
}

.operations-analysis-pv {
  min-height: 80px;
  position: relative;

  .wrap-report {
    width: 100%;
    height: 100%;
    // background: rgba(0, 163, 255, 0.06);
    // border: 1px solid #051823;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

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

  .model-wrapper-ftst {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .model-content {
      width: 1400px;
      height: 95%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);

      .content-title {
        width: 100%;
        height: 52px;
        line-height: 52px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background-image: url('../src/assets/title-bg.png');
        background-size: 100% 100%;
        border-bottom: 1px solid #013460;

        .left-title-font {
          display: flex;

          .font-icon {
            display: block;
            width: 24px;
            height: 24px;
            background-image: url('../src/assets/model-icon.png');
            background-size: 24px 24px;
            background-position: center center;
            background-repeat: no-repeat;
            margin-top: 14px;
          }

          .font-value {
            color: rgba(234, 245, 255, 1);
            font-size: 18px;
            margin-left: 15px;
          }
        }

        .right-close {
          width: 24px;
          height: 24px;
          // title-bg
          background-image: url('../src/assets/title-close.png');
          background-size: 14px 14px;
          background-position: center center;
          background-repeat: no-repeat;
          margin-top: 14px;
          cursor: pointer;
        }
      }

      .content-data {
        width: 100%;
        height: calc(100% - 52px);
        padding: 30px 0px;
        box-sizing: border-box;

        .frist-tab {
          width: 100%;
          height: 34px;
          margin-left: 30px;
        }

        .select-gro {
          display: flex;
          width: 100%;
          // height: 36px;
          height: 100%;
          line-height: 36px;
          box-sizing: border-box;
          padding-bottom: 20px;

          .dataTotal {
            display: flex;
            width: 100%;
            height: 100%;

            p {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #8d9cbd;
              margin-right: 40px;

              span {
                color: #ffffff;
              }
            }
          }

          .other {
            display: flex;
            position: absolute;
            right: 30px;

            .selest-time {
              display: flex;

              span {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #7b8aaa;
              }
            }
          }
        }

        .chart-pv {
          height: 85%;

          .charts {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.select-sty {
  inset: 226px auto auto 1176px !important;
  background-color: #030507;

  .el-popper__arrow::before {
    content: none;
  }

  .el-select-dropdown__list {
    margin: 0 !important;

    .el-select-dropdown__item {
      border-bottom: 1px solid #454e72;
      background-color: #030507;
      padding: 0 !important;
      text-align: center;
    }
  }
}
</style>
