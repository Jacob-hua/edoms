<template>
  <div class="operations-analysis" @click="handlerToShow($event, true)">
    <div class="top-bg"></div>
    <div class="bottom-font">运行分析</div>
    <div v-show="isShowModel" class="model-wrapper-gtst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">运行分析</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="sub-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">{{ '--' }}运行分析</span>
          </div>
          <div class="right-select">
            <span class="label-select">分析周期：</span>
            <div class="select" @click="handlrToShowOptions($event, true)">
              <span class="font-value">{{ dateValue }}</span>
            </div>
            <div v-show="isShowOptions" class="select-options">
              <div v-for="itm in dateOptions" :key="itm.value" class="option-item" @click="hanlderToChoose(itm.key)">
                {{ itm.key }}
              </div>
            </div>
          </div>
        </div>
        <div class="table-ft">
          <div class="table-title">
            <div v-for="itm in tableTitleList" :key="itm.value" class="title-itm" :style="{ width: itm.width }">
              {{ itm.key }}
            </div>
          </div>
          <div class="table-content">
            <div v-for="(itm, idx) in tableDataList" :key="idx" class="content-itm">
              <div class="unit-name-type" :style="{ width: tableTitleList[0].width }">
                <span class="unit-name">{{ itm.unitName }}</span>
                <span class="unit-type">{{ itm.unitType }}</span>
              </div>
              <div class="accumulate-value-unit" :style="{ width: tableTitleList[1].width }">
                <span class="accumulate-value">{{ itm.dataValue }}</span>
                <span class="accumulate-unit">{{ itm.unit }}</span>
              </div>
              <div class="time-power-ana" :style="{ width: tableTitleList[2].width }">
                <TabList :list="itm.timeUse" />
              </div>
              <div class="load-rate-ana" :style="{ width: tableTitleList[3].width }">
                <ChartData :list="itm.rateAna" :options="props.config.indicators" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import ChartData from './components/chartData.vue';
import TabList from './components/TabList.vue';
import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const dateOptions = ref<Array<{ [key: string]: string }>>([
  {
    key: '日',
    value: 'day',
  },
  {
    key: '月',
    value: 'month',
  },
  {
    key: '年',
    value: 'year',
  },
]);

const tableTitleList = ref<Array<{ [key: string]: string }>>([
  {
    key: '变压器单元',
    value: 'unitName',
    width: '18%',
  },
  {
    key: '累计电量',
    value: 'accumulatedPower',
    width: '15%',
  },
  {
    key: '分时电量分析',
    value: 'timePowerAna',
    width: '27%',
  },
  {
    key: '负载率分析',
    value: 'loadRateAna',
    width: '40%',
  },
]);

const isShowModel = ref<boolean>(false);

const isShowOptions = ref<boolean>(false);

const dateValue = ref<string>('日');

const tableDataList = ref<Array<any>>([
  {
    unitName: 'AH14 B楼4#变压器',
    unitType: '出线柜1',
    unit: '万kWh',
    dataValue: 0.444,
    timeUse: {
      rate: 0.52,
      list: [
        { key: '谷', value: 0.15, code: 'gu' },
        { key: '平', value: 0.25, code: 'ping' },
        { key: '峰', value: 0.3, code: 'feng' },
        { key: '尖', value: 0.3, code: 'jian' },
      ],
    },
    rateAna: {
      max: 0.55,
      min: 0.11,
      list: [
        { key: '过载', dis: '5', times: '3' },
        { key: '重载', dis: '5', times: '3' },
        { key: '轻载', dis: '5', times: '3' },
      ],
    },
  },
  {
    unitName: 'AH15 B楼4#变压器',
    unitType: '出线柜2',
    unit: '万kWh',
    dataValue: 0.444,
    timeUse: {
      rate: 0.52,
      list: [
        { key: '谷', value: 0.25, code: 'gu' },
        { key: '平', value: 0.25, code: 'ping' },
        { key: '峰', value: 0.25, code: 'feng' },
        { key: '尖', value: 0.25, code: 'jian' },
      ],
    },
    rateAna: {
      max: 0.55,
      min: 0.11,
      list: [
        { key: '过载', dis: '5', times: '3' },
        { key: '重载', dis: '5', times: '3' },
        { key: '轻载', dis: '5', times: '3' },
      ],
    },
  },
  {
    unitName: 'AH16 B楼4#变压器',
    unitType: '出线柜3',
    unit: '万kWh',
    dataValue: 0.444,
    timeUse: {
      rate: 0.52,
      list: [
        { key: '谷', value: 0.05, code: 'gu' },
        { key: '平', value: 0.25, code: 'ping' },
        { key: '峰', value: 0.25, code: 'feng' },
        { key: '尖', value: 0.45, code: 'jian' },
      ],
    },
    rateAna: {
      max: 0.55,
      min: 0.11,
      list: [
        { key: '过载', dis: '5', times: '3' },
        { key: '重载', dis: '5', times: '3' },
        { key: '轻载', dis: '5', times: '3' },
      ],
    },
  },
  {
    unitName: 'AH17 B楼4#变压器',
    unitType: '出线柜4',
    unit: '万kWh',
    dataValue: 0.444,
    timeUse: {
      rate: 0.52,
      list: [
        { key: '谷', value: 0.15, code: 'gu' },
        { key: '平', value: 0.3, code: 'ping' },
        { key: '峰', value: 0.3, code: 'feng' },
        { key: '尖', value: 0.25, code: 'jian' },
      ],
    },
    rateAna: {
      max: 0.55,
      min: 0.11,
      list: [
        { key: '过载', dis: '5', times: '3' },
        { key: '重载', dis: '5', times: '3' },
        { key: '轻载', dis: '5', times: '3' },
      ],
    },
  },
]);

const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const handlrToShowOptions = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowOptions.value = bl;
};

const handlerToClick = () => {
  isShowOptions.value = false;
};

const hanlderToChoose = (key: string) => {
  dateValue.value = key;
  isShowOptions.value = false;
  // handlerToClick();
};

watch(
  () => isShowModel.value,
  (newV) => {
    const dom = document.getElementsByClassName('model-wrapper-gtst')[0];
    newV
      ? dom.addEventListener('click', handlerToClick, false)
      : dom.removeEventListener('click', handlerToClick, false),
      (isShowOptions.value = false);
  }
);
</script>

<style lang="scss" scoped>
.operations-analysis {
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
  .model-wrapper-gtst {
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
      .sub-title {
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(29, 38, 52, 1);
        .left-title-font {
          display: flex;
          line-height: 32px;
          .font-icon {
            display: block;
            width: 18px;
            height: 18px;
            background-image: url('../src/assets/title-icon.png');
            background-size: 18px 18px;
            background-position: center center;
            background-repeat: no-repeat;
            margin-top: 7px;
          }
          .font-value {
            color: rgba(234, 245, 255, 1);
            font-size: 18px;
            margin-left: 15px;
          }
        }
        .right-select {
          display: flex;
          position: relative;
          .select-options {
            width: 98px;
            background-color: rgba(9, 15, 23, 1);
            border-radius: 4px;
            position: absolute;
            top: 34px;
            left: 90px;
            padding-top: 15px;
            box-sizing: border-box;
            border: 1px solid rgba(69, 78, 114, 1);
            .option-item {
              width: 100%;
              line-height: 25px;
              text-align: center;
              margin-bottom: 10px;
              color: rgba(234, 245, 255, 1);
              cursor: pointer;
              &:hover {
                background-color: #fff;
                color: rgba(9, 15, 23, 1);
              }
            }
          }
          .label-select {
            color: rgba(234, 245, 255, 1);
            line-height: 32px;
            font-size: 16px;
            margin-right: 10px;
          }
          .select {
            width: 98px;
            height: 32px;
            background-color: rgba(3, 5, 7, 1);
            border-radius: 4px;
            border: 1px solid rgba(69, 78, 114, 1);
            padding: 10px 20px;
            box-sizing: border-box;
            cursor: pointer;
            .font-value {
              color: #fff;
              font-size: 14px;
            }
          }
        }
      }
      .table-ft {
        width: calc(100% - 60px);
        height: 656px;
        margin: 0 auto;
        .table-title {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          .title-itm {
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: rgba(234, 245, 255, 1);
            font-size: 16px;
          }
        }
        .table-content {
          width: 100%;
          height: calc(100% - 50px);
          overflow: hidden;
          overflow-y: auto;
          .content-itm {
            width: 100%;
            height: 174px;
            margin-bottom: 30px;
            background-color: rgba(9, 15, 23, 0.3);
            border: 1px solid rgba(33, 44, 60, 1);
            box-sizing: border-box;
            display: flex;
            // justify-content: space-between;
            .unit-name-type {
              height: 100%;
              line-height: 174px;
              padding: 0 10px;
              border-right: 1px solid rgba(29, 38, 52, 1);
              text-align: center;
              color: rgba(234, 245, 255, 1);
              font-size: 16px;
              display: flex;
              justify-content: space-between;
              .unit-name {
                display: block;
                width: 60%;
                line-height: 174px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .unit-type {
                display: block;
                width: 80px;
                height: 36px;
                text-align: center;
                line-height: 36px;
                box-sizing: border-box;
                background-color: rgba(0, 163, 255, 0.1);
                border-radius: 2px;
                color: rgba(196, 229, 248, 1);
                font-size: 16px;
                margin-top: 70px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .accumulate-value-unit {
              height: 100%;
              line-height: 174px;
              border-right: 1px solid rgba(29, 38, 52, 1);
              text-align: center;
              color: rgba(234, 245, 255, 1);
              font-size: 16px;
              vertical-align: middle;
              .accumulate-value {
                color: rgba(65, 228, 222, 1);
                font-size: 18px;
                margin-right: 7px;
              }
              .accumulate-unit {
                color: rgba(234, 245, 255, 1);
                font-size: 14px;
              }
            }
            .time-power-ana {
              height: 100%;
              border-right: 1px solid rgba(29, 38, 52, 1);
              padding: 5px 20px;
              box-sizing: border-box;
            }
            .load-rate-ana {
              height: 100%;
              padding: 30px 30px;
              box-sizing: border-box;
            }
          }
        }
        .table-content::-webkit-scrollbar {
          width: 3px;
          height: 1px;
        }

        .table-content::-webkit-scrollbar-thumb {
          border-radius: 3px;
          // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
          background: rgba(4, 70, 108, 1);
        }

        .table-content::-webkit-scrollbar-track {
          // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          background: transparent;
        }
      }
    }
  }
}
</style>
