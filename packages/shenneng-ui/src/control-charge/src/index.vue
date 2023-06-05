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
        <div class="content-body">
          <div class="body-top">
            <TopItem v-for="item in option.list" :key="item.num" :option="item"></TopItem>
          </div>
          <div class="body-con">
            <div class="screen">
              <div class="screen-con">
                <span class="span-tex">参与调控功率</span>
                <el-input v-model="input" class="input" placeholder="请输入" />
              </div>
              <div style="display: flex">
                <span class="span-tex">时间选择</span>
                <TimeCalendar :option="timeType"></TimeCalendar>
              </div>
              <el-button class="but" type="primary" plain @click="markSure">确认</el-button>
            </div>
            <div class="screen-card">
              <ItemCard
                v-for="item in dataCard.list"
                :key="item.name"
                :option="item"
                @ct-options="getControl"
              ></ItemCard>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      align-center
      class="tipDialog"
      width="600px"
      top="62px"
      style="height: 300px; background: #000; border: 1px solid #013460"
    >
      <template #header>
        <div class="top">
          <span class="label">提示</span>
        </div>
      </template>
      <div class="content">
        <div class="tip">
          <div class="icon">
            <img src="./assets/tipIcon.png" alt="" />
          </div>
          <div style="line-height: 25px">
            <span>已选用设备未达到当前设置功率，请勾选其他设备以达到设定值</span>
          </div>
        </div>
        <button class="but" @click="dialogVisible = false">确认</button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import control from './assets/control.png';
import dianciB from './assets/dianciB.png';
import dianciG from './assets/dianciG.png';
import dianciR from './assets/dianciR.png';
import dianciY from './assets/dianciY.png';
import ItemCard from './components/ItemCard.vue';
import TimeCalendar from './components/TimeCalendar.vue';
import TopItem from './components/TopItem.vue';
import { MAssetInformationConfig } from './type';

defineProps<{
  config: MAssetInformationConfig;
}>();
const timeType = ref('date');
const input = ref('');
const dialogVisible = ref<boolean>(false);
const isShowModel = ref<boolean>(false);
const option = reactive<{ [list: string]: any }>({
  list: [
    { title: '充电中', icon: dianciG, num: 12, params: 246 },
    { title: '待机', icon: dianciB, num: 6, params: 326 },
    { title: '摘枪', icon: dianciY, num: 1, params: 126 },
    { title: '故障', icon: dianciR, num: 1, params: 126 },
    { title: '参与调控', icon: control, num: 1, params: 126 },
  ],
});
const dataCard = reactive<{ [list: string]: any }>({
  list: [
    {
      id: 1,
      name: '1-1充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 2,
      name: '1-2充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: true,
      state: 'normal',
      class: '',
    },
    {
      id: 3,
      name: '1-3充电桩',
      switch: '0',
      charging: '-',
      remainder: '1小时30分钟',
      checked: false,
      state: '故障',
      class: 'red',
    },
    {
      id: 4,
      name: '1-4充电桩',
      switch: '0',
      charging: '-',
      remainder: '1小时30分钟',
      checked: false,
      state: '待机',
      class: 'green',
    },
    {
      id: 5,
      name: '1-5充电桩',
      switch: '0',
      charging: '-',
      remainder: '1小时30分钟',
      checked: false,
      state: '摘枪',
      class: 'yellow',
    },
    {
      id: 6,
      name: '1-6充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 7,
      name: '1-7充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 8,
      name: '1-8充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 9,
      name: '1-9充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 10,
      name: '1-10充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 11,
      name: '1-11充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 12,
      name: '1-12充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 13,
      name: '1-13充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 14,
      name: '1-14充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
    {
      id: 15,
      name: '1-15充电桩',
      switch: '1',
      charging: '60',
      remainder: '1小时30分钟',
      checked: false,
      state: 'normal',
      class: '',
    },
  ],
});
const getControl = (opt: any) => {
  console.log({ tit: '参数调控', opt: opt });
  const contorlData = dataCard.list.filter(({ checked }: any) => {
    return checked === true;
  });
  option.list[4].num = contorlData.length;
  option.list[4].params = contorlData.length * 126;
};
const markSure = () => {
  if (input.value && Number(input.value) > option.list[4].params) {
    console.log('弹出框');
    dialogVisible.value = true;
  }
};
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  width: 80px;
  height: 32px;
  background: rgba(0, 163, 255, 0.26);
  border: 1px solid #007bc0;
  border-radius: 4px;
}

:deep(.el-input__wrapper) {
  background: #030507;
  border: 1px solid #454e72;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
  width: 100%;
  height: calc(100% - 52px);
}

:deep(.el-input) {
  --el-input-text-color: #eaf5ff;
}

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
      width: 1480px;
      height: 800px;
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
            background-image: url('../src/assets/charge.png');
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

      .content-body {
        width: 100%;
        height: calc(100% - 52px);

        .body-top {
          width: 100%;
          height: 120px;
          border-bottom: 1px solid #1d2634;
          padding: 20px 28px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(5, 270px);
          gap: 20px;
        }

        .body-con {
          width: 100%;
          height: 85%;
          padding: 20px 28px;
          box-sizing: border-box;

          .screen {
            width: 100%;
            height: 32px;
            display: flex;
            line-height: 32px;

            .but {
              margin-left: 18px;
            }

            .screen-con {
              display: flex;
              margin-right: 60px;

              .input {
                width: 180px;
                height: 32px;
                color: #eaf5ff;
              }
            }

            .span-tex {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #eaf5ff;
              margin-right: 15px;
            }
          }

          .screen-card {
            width: 100%;
            height: calc(100% - 52px);
            box-sizing: border-box;
            padding-top: 30px;
            display: grid;
            grid-template-columns: repeat(5, 270px);
            grid-template-rows: repeat(3, 150px);
            gap: 20px;
          }
        }
      }
    }
  }

  .tipDialog {
    width: 100%;
    height: 100%;
    position: relative;

    .top {
      width: 100%;
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #013460;
      background-image: url('./assets/title-bg.png');
      background-size: 100% 100%;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;

      .label {
        margin-left: 20px;
      }
    }

    .content {
      width: 100%;
      height: 100%;

      .tip {
        width: 65%;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffb400;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        .icon {
          width: 51px;
          height: 51px;
          margin-right: 20px;
        }
      }

      .but {
        width: 80px;
        height: 32px;
        background: rgba(0, 163, 255, 0.26);
        border: 1px solid #007bc0;
        border-radius: 4px;
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
      }
    }
  }
}
</style>
