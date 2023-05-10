<template>
  <div class="efficency-analysis" @click="handlerToShow($event, true)">
    <div class="top-bg"></div>
    <div class="bottom-font">能效分析</div>
    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">能效分析</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="tab-list">
          <div
            v-for="(itm, idx) in TabOptions"
            :key="itm.value"
            :class="['list-itm', currentIdx === idx ? 'active' : '']"
            @click="handlerToChange(idx)"
          >
            {{ itm.key }}
          </div>
        </div>
        <div v-show="currentIdx === 0" class="content-tab">
          <TabList :list="TabOptions" class="ft-st" />
          <systemTab />
        </div>
        <div v-show="currentIdx === 1" class="content-tab">
          <coldTab />
        </div>
        <div v-show="currentIdx === 2" class="content-tab">
          <fuelTab />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import coldTab from './components/coldTab.vue';
import fuelTab from './components/fuelTab.vue';
import systemTab from './components/systemTab.vue';
import TabList from './components/TabList.vue';
// import { AnaItemConfigs } from './type';

// const props = defineProps<{
//   config: AnaItemConfigs;
// }>();

// console.log(props);

const currentIdx = ref<number>(0);

const TabOptions = ref<Array<{ [key: string]: string }>>([
  {
    key: '系统能效分析',
    value: 'system',
  },
  {
    key: '制冷检测',
    value: 'cold',
  },
  {
    key: '燃料监测',
    value: 'fuel',
  },
]);

const isShowModel = ref<boolean>(false);

const isShowOptions = ref<boolean>(false);

const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const handlerToChange = (idx: number) => {
  if (currentIdx.value === idx) return;
  currentIdx.value = idx;
};

const handlerToClick = () => {
  isShowOptions.value = false;
};

watch(
  () => isShowModel.value,
  (newV) => {
    const dom = document.getElementsByClassName('model-wrapper-ftst')[0];
    newV
      ? dom.addEventListener('click', handlerToClick, false)
      : dom.removeEventListener('click', handlerToClick, false),
      (isShowOptions.value = false);
  }
);
</script>

<style lang="scss" scoped>
.efficency-analysis {
  width: 117px;
  height: 82px;
  position: relative;
  padding: 10px 28px;
  box-sizing: border-box;
  background-color: rgba(0, 163, 255, 0.1);
  border: 1px solid rgba(11, 17, 25, 0.3);
  .top-bg {
    width: 60px;
    height: 42px;
    background-color: rgba(0, 114, 179, 0.3);
    background-image: url('../src/assets/outer-bg.png');
    background-size: 24px 24px;
    background-position: center center;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 114, 179, 1);
    box-sizing: border-box;
    border-radius: 3px;
    cursor: pointer;
  }
  .bottom-font {
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    margin-top: 6px;
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
      width: 1484px;
      height: 788px;
      position: absolute;
      left: 50%;
      margin-left: -765px;
      margin-top: 199px;
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);
      .content-title {
        width: 100%;
        height: 52px;
        // background-color: rgba(134, 31, 127, 0.06);
        line-height: 52px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background-image: url('../src/assets/title-bg.png');
        background-size: 100% 100%;
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
      .tab-list {
        width: 100%;
        height: 34px;
        margin-top: 31px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        // justify-content: space-between;
        .list-itm {
          width: 130px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          margin-right: 20px;
          color: #eaf5ff;
          font-size: 16px;
          background-color: rgba(0, 163, 255, 0.12);
          cursor: pointer;
          &.active {
            border: 1px solid #007bc0;
            box-sizing: border-box;
            color: #ffffff;
            background-color: rgba(0, 163, 255, 0.26);
          }
        }
      }
      .ft-st {
        width: 100%;
        height: 80px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      .content-tab {
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%;
        height: 500px;
      }
      // .table-content::-webkit-scrollbar {
      //   width: 3px;
      //   height: 1px;
      // }

      // .table-content::-webkit-scrollbar-thumb {
      //   border-radius: 3px;
      //   // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      //   background: rgba(4, 70, 108, 1);
      // }

      // .table-content::-webkit-scrollbar-track {
      //   // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      //   border-radius: 3px;
      //   background: transparent;
      // }
    }
  }
}
</style>
