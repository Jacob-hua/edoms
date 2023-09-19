<template>
  <div class="operations-analysis-water" @click="handlerToShow($event, true)">
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
            <!-- <span class="font-icon"></span> -->
            <span class="font-value">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-data">
          <el-form :model="runningForm" :inline="true" label-position="top">
            <el-form-item :label="t('电池放电深度DOD上限')" prop="DOD" style="width: 90%">
              <el-input v-model="runningForm.DOD">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('最大放电功率')" prop="maxDischargePower" style="width: 40%; margin-right: 10%">
              <el-input v-model="runningForm.maxDischargePower">
                <template #append>kW</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('最小放电功率')" prop="minDischargePower" style="width: 40%">
              <el-input v-model="runningForm.minDischargePower">
                <template #append>kW</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('最大充电功率')" prop="maxChargePower" style="width: 40%; margin-right: 10%">
              <el-input v-model="runningForm.maxChargePower">
                <template #append>kW</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('最小充电功率')" prop="minChargePower" style="width: 40%">
              <el-input v-model="runningForm.minChargePower">
                <template #append>kW</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('日循环次数')" prop="cyclesNumber" style="width: 90%">
              <el-input v-model="runningForm.cyclesNumber">
                <template #append>{{ t('次日') }}</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit($event)">{{ t('确认') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useApp } from '../../useApp';

import locales from './locales';
import { MAssetInformationConfig } from './type';

const props = defineProps<{
  config: MAssetInformationConfig;
}>();

const { setMessage, t } = useApp(props);

setMessage(locales);

const isShowModel = ref<boolean>(false);

const runningForm = reactive({
  DOD: '80',
  maxDischargePower: '1100',
  minDischargePower: '80',
  maxChargePower: '1100',
  minChargePower: '80',
  cyclesNumber: '3',
});
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const onSubmit = (ev: Event) => {
  ev.stopPropagation();
  isShowModel.value = false;
};
</script>

<style lang="scss" scoped>
.operations-analysis-water {
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
      text-align: center;
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
      width: 600px;
      height: 50%;
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
        // margin: 10px 20px 30px;
        overflow-y: scroll;
        display: flex;
        flex-flow: column;

        :deep(.el-form) {
          justify-content: center;
          margin-top: 10px;
        }

        :deep(.el-form-item__label) {
          --el-text-color-regular: rgba(234, 245, 255, 1);
        }

        :deep(.el-form-item) {
          margin-right: 0;
        }

        :deep(.el-input__wrapper) {
          --el-input-text-color: rgba(255, 255, 255, 1);
          --el-input-border-color: rgba(69, 78, 114, 1);
          background-color: transparent;
          box-shadow: none;
          border: 1px solid #454e72;
          border-right: 0;
        }

        :deep(.el-input-group__append) {
          --el-input-border-color: rgba(69, 78, 114, 1);
          --el-color-info: rgba(255, 255, 255, 1);
          background-color: transparent;
          box-shadow: none;
          border: 1px solid #454e72;
          border-left: 0;
        }

        :deep(.el-button) {
          --el-button-bg-color: rgba(0, 163, 255, 0.26);
          --el-button-border-color: rgba(0, 163, 255, 0.26);
          --el-button-text-color: #eaf5ff;
        }
      }
    }
  }
}
</style>
