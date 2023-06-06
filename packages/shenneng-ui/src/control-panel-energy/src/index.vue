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
            <span class="font-icon"></span>
            <span class="font-value">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-data">
          <div class="model-box">
            <div class="model">
              <span>当前模式：</span>
              <span class="current-model">{{ currentModel }}</span>
            </div>
            <div class="change-btn">
              <el-button @click="handleShowModelDialog">模式切换</el-button>
            </div>
          </div>
          <AutomaticMode v-if="autoModel"></AutomaticMode>
          <ManualMode v-if="!autoModel" @setting-action="handleShowSettingDialog"></ManualMode>
        </div>
      </div>
    </div>
    <SettingDialog
      v-if="settingDialogVisible"
      v-model:visible="settingDialogVisible"
      @submit-setting="handleSetStatus"
    ></SettingDialog>
    <ModeDialog v-model:visible="ModeDialogVisible" @change-model="handleChangeModel"></ModeDialog>
    <PermissionsAuditing
      v-model:visible="PermissionDialogVisible"
      @check-permission="handleCheckPermission"
    ></PermissionsAuditing>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AutomaticMode from './component/AutomaticMode.vue';
import ManualMode from './component/ManualMode.vue';
import ModeDialog from './component/ModeDialog.vue';
import PermissionsAuditing from './component/PermissionsAuditing.vue';
import SettingDialog from './component/SettingDialog.vue';
import { MAssetInformationConfig } from './type';

defineProps<{
  config: MAssetInformationConfig;
}>();
const isShowModel = ref<boolean>(false);
const settingDialogVisible = ref<boolean>(false);
const ModeDialogVisible = ref<boolean>(false);
const PermissionDialogVisible = ref<boolean>(false);
const currentModel = ref('自动模式');
const autoModel = ref(true);
const flag = ref('');
const tempMode = ref('');
const tempStatus = ref({});
const manualStatus = ref();

const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const handleChangeModel = (model: string) => {
  tempMode.value = model;
  PermissionDialogVisible.value = true;
  // autoModel.value = !autoModel.value;
  // currentModel.value = model;
};

const handleShowModelDialog = () => {
  flag.value = 'change';
  ModeDialogVisible.value = true;
};

const handleShowSettingDialog = (val: boolean) => {
  flag.value = 'setting';
  settingDialogVisible.value = val;
};

const handleSetStatus = (val: any) => {
  tempStatus.value = val;
  PermissionDialogVisible.value = true;
};

const handleCheckPermission = (val: boolean) => {
  if (val) {
    if (flag.value === 'change') {
      autoModel.value = !autoModel.value;
      currentModel.value = tempMode.value;
    }
    if (flag.value === 'setting') {
      manualStatus.value = tempStatus.value;
    }
  }
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
      width: 1479px;
      height: 80%;
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
        // width: 100%;
        margin: 10px 20px 30px;
        overflow-y: scroll;
        display: flex;
        flex-flow: column;
        color: rgba(234, 245, 255, 1);

        :deep(.el-form) {
          justify-content: center;
        }

        .model-box {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          align-items: center;
          grid-column-gap: 40px;
          padding: 10px 0 20px;

          .current-model {
            color: rgba(56, 208, 20, 1);
          }
        }

        // :deep(.el-form-item__label) {
        //   --el-text-color-regular: rgba(234, 245, 255, 1);
        // }

        // :deep(.el-input__wrapper) {
        //   --el-input-text-color: rgba(255, 255, 255, 1);
        //   --el-input-border-color: rgba(69, 78, 114, 1);
        //   background-color: transparent;
        // }

        // :deep(.el-input-group__append) {
        //   --el-input-border-color: rgba(69, 78, 114, 1);
        //   --el-color-info: rgba(255, 255, 255, 1);
        //   background-color: transparent;
        // }

        :deep(.el-button) {
          --el-button-bg-color: rgba(0, 163, 255, 0.26);
          --el-button-border-color: rgba(0, 163, 255, 0.26);
          --el-button-text-color: #eaf5ff;
          --el-button-hover-bg-color: rgba(0, 163, 255, 0.26);
        }
      }
    }
  }
}
</style>
