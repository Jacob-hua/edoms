<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-05-11 15:36:20
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-16 11:00:33
-->
<template>
  <div class="operations-analysis-heat" @click="handlerToShow($event, true)">
    <div class="top-bg"></div>
    <div class="bottom-font">{{ config.title }}</div>
    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">运行分析</span>
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
        <div class="content-ft">
          <div v-for="(itm, idx) in getDataList" :key="idx" class="item-tab-st">
            <TabList :list="itm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

// import coldTab from './components/coldTab.vue';
// import fuelTab from './components/fuelTab.vue';
// import systemTab from './components/systemTab.vue';
import TabList from './components/TabList.vue';
import { AnaItemConfigs } from './type';

defineProps<{
  config: AnaItemConfigs;
}>();

// console.log(props);

const currentIdx = ref<number>(0);

const TabOptions = ref<Array<{ [key: string]: string }>>([
  {
    key: '全部',
    value: 'all',
  },
  {
    key: '热源泵',
    value: 'heatPump',
  },
  // {
  //   key: '流量计',
  //   value: 'flow',
  // },
  {
    key: '水泵',
    value: 'waterPump',
  },
]);

const dataList = ref<Array<{ [key: string]: any }>>([
  {
    name: '1#空气热源泵',
    type: 'heatPump',
    chartList: [
      {
        name: '进水温度',
        value: '0°C',
        maxValue: 30,
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '出水温度',
        value: '41°C',
        maxValue: 50,
        chartData: [11, 2, 3, 4, 51, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '2#空气热源泵',
    type: 'heatPump',
    chartList: [
      {
        name: '进水温度',
        value: '0°C',
        maxValue: 20,
        chartData: [13, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '出水温度',
        value: '30°C',
        maxValue: 40,
        chartData: [1, 26, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '3#空气热源泵',
    type: 'heatPump',
    chartList: [
      {
        name: '进水温度',
        value: '0°C',
        maxValue: 30,
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '出水温度',
        value: '35°C',
        maxValue: 50,
        chartData: [21, 22, 32, 24, 25, 16, 17, 18, 19, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '4#空气热源泵',
    type: 'heatPump',
    chartList: [
      {
        name: '进水温度',
        value: '0°C',
        maxValue: 40,
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '1#水箱蓄水泵',
    type: 'waterPump',
    chartList: [
      {
        name: '负载率',
        value: '40%',
        maxValue: 50,
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '变频器频率',
        value: '40HZ',
        maxValue: 50,
        chartData: [21, 22, 31, 34, 35, 36, 37, 38, 39, 20, 41, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '2#水箱蓄水泵',
    type: 'waterPump',
    chartList: [
      {
        name: '负载率',
        value: '50%',
        maxValue: 60,
        chartData: [31, 32, 31, 34, 35, 36, 37, 38, 39, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '变频器频率',
        value: '50HZ',
        maxValue: 55,
        chartData: [21, 22, 31, 34, 35, 36, 37, 38, 39, 20, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '3#水箱蓄水泵',
    type: 'waterPump',
    chartList: [
      {
        name: '负载率',
        value: '60%',
        maxValue: 70,
        chartData: [51, 52, 23, 34, 25, 16, 17, 28, 39, 40, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '变频器频率',
        value: '60HZ',
        maxValue: 65,
        chartData: [21, 22, 31, 34, 35, 36, 37, 38, 39, 20, 61, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '4#水箱蓄水泵',
    type: 'waterPump',
    chartList: [
      {
        name: '负载率',
        value: '65%',
        maxValue: 70,
        chartData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '变频器频率',
        value: '70HZ',
        maxValue: 80,
        chartData: [21, 22, 31, 34, 35, 31, 32, 33, 21, 20, 61, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
  {
    name: '5#水箱蓄水泵',
    type: 'waterPump',
    chartList: [
      {
        name: '负载率',
        value: '80%',
        maxValue: 90,
        chartData: [100, 120, 113, 114, 115, 126, 127, 118, 119, 110, 121, 112, 113],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
      {
        name: '变频器频率',
        value: '90HZ',
        maxValue: 100,
        chartData: [21, 22, 31, 34, 15, 30, 37, 38, 39, 20, 21, 12, 13],
        xAisData: [
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
        ],
      },
    ],
  },
]);

const getDataList = computed(() => {
  const code = TabOptions.value[currentIdx.value].value;
  if (code === 'all') return dataList.value;
  return dataList.value.filter((itm: { [key: string]: string }) => itm.type === code);
});

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
.operations-analysis-heat {
  min-width: 117px;
  min-height: 80px;
  //   position: relative;
  //   padding: 10px 28px;
  //   box-sizing: border-box;
  background-color: rgba(0, 163, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //   width: 117px;
  //   height: 82px;
  //   position: relative;
  //   padding: 10px 28px;
  //   box-sizing: border-box;
  //   background-color: rgba(0, 163, 255, 0.1);
  //   border: 1px solid rgba(11, 17, 25, 0.3);
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
      width: 1800px;
      height: 860px;
      position: absolute;
      left: 50%;
      margin-left: -900px;
      margin-top: 70px;
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
      .content-ft {
        width: 1740px;
        height: 700px;
        margin: 20px auto;
        overflow: hidden;
        overflow-y: auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item-tab-st {
          width: 48.5%;
          height: 280px;
          margin-bottom: 30px;
        }
      }
      .content-ft::-webkit-scrollbar {
        width: 3px;
        height: 1px;
      }

      .content-ft::-webkit-scrollbar-thumb {
        border-radius: 3px;
        // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
        background: rgba(4, 70, 108, 1);
      }

      .content-ft::-webkit-scrollbar-track {
        // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        background: transparent;
      }
    }
  }
}
</style>
